// ==============================================================================
// NUTRILEARN - PASSWORD SECURITY HELPERS (Thesis Chapter 2.2: Security & Privacy)
// ------------------------------------------------------------------------------
// Passwords are never stored in plain text. Each account keeps a random salt and
// a PBKDF2-HMAC-SHA256 hash of the password. The same algorithm runs on the
// FastAPI backend (main.py -> hash_password) so a hash made here can be verified
// there, and vice versa.
//
// This is a synchronous pure-JS implementation on purpose: it works on file://,
// plain-http LAN addresses and inside the Android APK WebView, where
// crypto.subtle is not always available.
// ==============================================================================

(function () {
  'use strict';

  const ITERATIONS = 10000;
  const ALGO = 'pbkdf2-sha256';

  const K = new Uint32Array([
    0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
    0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
    0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
    0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
    0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
    0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
    0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
    0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
  ]);

  function utf8(str) {
    return new TextEncoder().encode(String(str));
  }

  function toHex(bytes) {
    let out = '';
    for (let i = 0; i < bytes.length; i++) out += bytes[i].toString(16).padStart(2, '0');
    return out;
  }

  function sha256(data) {
    const len = data.length;
    const bitLenHi = Math.floor(len / 0x20000000);
    const bitLenLo = (len << 3) >>> 0;
    const padded = new Uint8Array(((len + 9 + 63) >> 6) << 6);
    padded.set(data);
    padded[len] = 0x80;
    const dv = new DataView(padded.buffer);
    dv.setUint32(padded.length - 8, bitLenHi);
    dv.setUint32(padded.length - 4, bitLenLo);

    let h0 = 0x6a09e667, h1 = 0xbb67ae85, h2 = 0x3c6ef372, h3 = 0xa54ff53a;
    let h4 = 0x510e527f, h5 = 0x9b05688c, h6 = 0x1f83d9ab, h7 = 0x5be0cd19;
    const w = new Uint32Array(64);

    for (let off = 0; off < padded.length; off += 64) {
      for (let i = 0; i < 16; i++) w[i] = dv.getUint32(off + i * 4);
      for (let i = 16; i < 64; i++) {
        const x = w[i - 15], y = w[i - 2];
        const s0 = ((x >>> 7) | (x << 25)) ^ ((x >>> 18) | (x << 14)) ^ (x >>> 3);
        const s1 = ((y >>> 17) | (y << 15)) ^ ((y >>> 19) | (y << 13)) ^ (y >>> 10);
        w[i] = (w[i - 16] + s0 + w[i - 7] + s1) >>> 0;
      }
      let a = h0, b = h1, c = h2, d = h3, e = h4, f = h5, g = h6, h = h7;
      for (let i = 0; i < 64; i++) {
        const S1 = ((e >>> 6) | (e << 26)) ^ ((e >>> 11) | (e << 21)) ^ ((e >>> 25) | (e << 7));
        const ch = (e & f) ^ (~e & g);
        const t1 = (h + S1 + ch + K[i] + w[i]) >>> 0;
        const S0 = ((a >>> 2) | (a << 30)) ^ ((a >>> 13) | (a << 19)) ^ ((a >>> 22) | (a << 10));
        const maj = (a & b) ^ (a & c) ^ (b & c);
        const t2 = (S0 + maj) >>> 0;
        h = g; g = f; f = e; e = (d + t1) >>> 0;
        d = c; c = b; b = a; a = (t1 + t2) >>> 0;
      }
      h0 = (h0 + a) >>> 0; h1 = (h1 + b) >>> 0; h2 = (h2 + c) >>> 0; h3 = (h3 + d) >>> 0;
      h4 = (h4 + e) >>> 0; h5 = (h5 + f) >>> 0; h6 = (h6 + g) >>> 0; h7 = (h7 + h) >>> 0;
    }

    const out = new Uint8Array(32);
    const odv = new DataView(out.buffer);
    [h0, h1, h2, h3, h4, h5, h6, h7].forEach((v, i) => odv.setUint32(i * 4, v));
    return out;
  }

  function concat(a, b) {
    const out = new Uint8Array(a.length + b.length);
    out.set(a);
    out.set(b, a.length);
    return out;
  }

  // HMAC-SHA256 with precomputed inner/outer pads (reused for every PBKDF2 round)
  function makeHmac(key) {
    if (key.length > 64) key = sha256(key);
    const ipad = new Uint8Array(64);
    const opad = new Uint8Array(64);
    for (let i = 0; i < 64; i++) {
      const k = i < key.length ? key[i] : 0;
      ipad[i] = k ^ 0x36;
      opad[i] = k ^ 0x5c;
    }
    return (msg) => sha256(concat(opad, sha256(concat(ipad, msg))));
  }

  // PBKDF2-HMAC-SHA256, single 32-byte block (same as Python hashlib.pbkdf2_hmac, dklen=32)
  function pbkdf2(password, salt, iterations) {
    const hmac = makeHmac(utf8(password));
    let u = hmac(concat(utf8(salt), new Uint8Array([0, 0, 0, 1])));
    const t = new Uint8Array(u);
    for (let i = 1; i < iterations; i++) {
      u = hmac(u);
      for (let j = 0; j < 32; j++) t[j] ^= u[j];
    }
    return toHex(t);
  }

  function randomSalt() {
    const bytes = new Uint8Array(16);
    if (window.crypto && window.crypto.getRandomValues) {
      window.crypto.getRandomValues(bytes);
    } else {
      for (let i = 0; i < 16; i++) bytes[i] = Math.floor(Math.random() * 256);
    }
    return toHex(bytes);
  }

  function hashPassword(password, salt) {
    const s = salt || randomSalt();
    return {
      passwordHash: pbkdf2(password, s, ITERATIONS),
      passwordSalt: s,
      passwordAlgo: ALGO,
      passwordIterations: ITERATIONS
    };
  }

  function verifyPassword(password, user) {
    if (!user || !user.passwordHash || !user.passwordSalt) return false;
    const iterations = user.passwordIterations || ITERATIONS;
    const candidate = pbkdf2(password, user.passwordSalt, iterations);
    // Constant-time comparison
    if (candidate.length !== user.passwordHash.length) return false;
    let diff = 0;
    for (let i = 0; i < candidate.length; i++) {
      diff |= candidate.charCodeAt(i) ^ user.passwordHash.charCodeAt(i);
    }
    return diff === 0;
  }

  const SECRET_FIELDS = ['password', 'passwordHash', 'passwordSalt', 'passwordAlgo', 'passwordIterations'];

  // Copy of a user object with every credential field removed (for sessions/UI)
  function publicUser(user) {
    if (!user || typeof user !== 'object') return user;
    const copy = { ...user };
    SECRET_FIELDS.forEach(f => delete copy[f]);
    return copy;
  }

  // Replace a plain-text `password` field with a salted hash (mutates and returns user)
  function secureUser(user) {
    if (!user || typeof user !== 'object') return user;
    if (typeof user.password === 'string' && user.password !== '') {
      Object.assign(user, hashPassword(user.password));
    }
    delete user.password;
    return user;
  }

  window.NutriSecurity = {
    ITERATIONS,
    sha256Hex: (str) => toHex(sha256(utf8(str))),
    hashPassword,
    verifyPassword,
    publicUser,
    secureUser,
    SECRET_FIELDS
  };
})();
