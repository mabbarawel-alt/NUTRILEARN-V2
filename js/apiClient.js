// ==============================================================================
// NUTRILEARN - UNIFIED REST API CLIENT (Backend on Render & Local)
// Offline-first bridge between UI and FastAPI Backend
// ------------------------------------------------------------------------------
// Thesis Activity Diagrams 3.2.1 & 3.2.2: "Internet available? → No → Save /
// cache locally → Sync to server on reconnection".
// Every write (child records, reports, announcements, accounts, Try-it-at-home
// logs) is saved on the phone first. If the backend cannot be reached, the
// request waits in an outbox (localStorage) and is sent, in order, as soon as
// the connection returns.
// ==============================================================================

(function() {
  'use strict';

  // Base API URL detection (relative in production/Render, or localhost during local dev)
  const API_BASE = window.NUTRI_API_BASE || (window.location.origin.includes('localhost:8085') ? 'http://localhost:8085/api' : '/api');
  // Opened as a local file (e.g. the APK) with no backend configured: nothing to sync to
  const HAS_BACKEND = window.location.protocol !== 'file:' || Boolean(window.NUTRI_API_BASE);

  const QUEUE_KEY = 'nutrilearn_sync_queue_v1';
  const MAX_QUEUE = 500;

  window.NutriApi = {
    baseUrl: API_BASE,
    isAvailable: false,
    isSyncing: false,

    async checkHealth() {
      if (!HAS_BACKEND) {
        this.isAvailable = false;
        return false;
      }
      try {
        const res = await fetch(`${this.baseUrl}/health`, { method: 'GET', headers: { 'Accept': 'application/json' }, cache: 'no-store' });
        if (res.ok) {
          this.isAvailable = true;
          console.log('🚀 [NutriApi] Backend API is ONLINE:', this.baseUrl);
          this.flushQueue();
          return true;
        }
      } catch (e) {
        console.info('ℹ️ [NutriApi] Backend API not reachable, falling back to local/client storage.');
      }
      this.isAvailable = false;
      this.updateSyncIndicator();
      return false;
    },

    // --------------------------------------------------------------------------
    // Offline outbox
    // --------------------------------------------------------------------------
    getQueue() {
      try {
        return JSON.parse(localStorage.getItem(QUEUE_KEY) || '[]');
      } catch (e) {
        return [];
      }
    },

    saveQueue(queue) {
      try {
        localStorage.setItem(QUEUE_KEY, JSON.stringify(queue.slice(-MAX_QUEUE)));
      } catch (e) {
        console.warn('[NutriApi] Could not save sync queue:', e);
      }
      this.updateSyncIndicator();
    },

    pendingCount() {
      return this.getQueue().length;
    },

    // `dedupeKey` lets a newer edit of the same record replace an older queued edit
    enqueue(method, path, body, dedupeKey) {
      if (!HAS_BACKEND) return;
      let queue = this.getQueue();
      if (dedupeKey) queue = queue.filter(item => item.dedupeKey !== dedupeKey);
      queue.push({
        id: 'q-' + Date.now() + '-' + Math.random().toString(36).slice(2, 7),
        method, path, body, dedupeKey: dedupeKey || null,
        queuedAt: new Date().toISOString()
      });
      this.saveQueue(queue);
      console.info(`📥 [NutriApi] Offline: queued ${method} ${path} (${queue.length} pending)`);
    },

    // Send now if possible, otherwise queue. Returns the server response or null.
    async send(method, path, body, dedupeKey) {
      // Keep order: if older items are waiting, this one waits behind them
      if (!this.isAvailable || !navigator.onLine || this.pendingCount() > 0) {
        this.enqueue(method, path, body, dedupeKey);
        if (this.isAvailable && navigator.onLine) this.flushQueue();
        return null;
      }
      try {
        const res = await fetch(`${this.baseUrl}${path}`, {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: body === undefined ? undefined : JSON.stringify(body)
        });
        if (res.ok) return await res.json().catch(() => true);
        if (res.status >= 500) {
          this.enqueue(method, path, body, dedupeKey);
        } else {
          console.warn(`[NutriApi] ${method} ${path} rejected (${res.status}); not retried.`);
        }
      } catch (e) {
        // Network failure: the connection dropped between checks
        this.isAvailable = false;
        this.enqueue(method, path, body, dedupeKey);
      }
      return null;
    },

    // Send queued requests in order; stops at the first network failure
    async flushQueue() {
      if (this.isSyncing || !HAS_BACKEND || !navigator.onLine) return;
      let queue = this.getQueue();
      if (!queue.length) {
        this.updateSyncIndicator();
        return;
      }
      this.isSyncing = true;
      this.updateSyncIndicator();
      let sent = 0;
      while (queue.length) {
        const item = queue[0];
        try {
          const res = await fetch(`${this.baseUrl}${item.path}`, {
            method: item.method,
            headers: { 'Content-Type': 'application/json' },
            body: item.body === undefined ? undefined : JSON.stringify(item.body)
          });
          if (res.status >= 500) break;                 // server trouble: try again later
          if (!res.ok) console.warn(`[NutriApi] Dropped queued ${item.method} ${item.path} (${res.status})`);
          else sent++;
        } catch (e) {
          this.isAvailable = false;                     // still offline
          break;
        }
        queue.shift();
        this.saveQueue(queue);
        queue = this.getQueue();
      }
      this.isSyncing = false;
      this.updateSyncIndicator();
      if (sent > 0) {
        this.isAvailable = true;
        if (typeof NutriStorage !== 'undefined') {
          NutriStorage.logAudit('Offline Data Synced', 'Synchronization', `${sent} record(s) saved while offline were sent to the server`);
        }
        if (window.NutriApp && typeof NutriApp.showToast === 'function') {
          NutriApp.showToast(`🔄 Naipadala na ang ${sent} talaang na-save habang offline. / ${sent} offline record(s) synced.`, 'success');
        }
      }
    },

    // Small status pill: "Offline" and/or "N pending sync"
    updateSyncIndicator() {
      const el = document.getElementById('nutri-sync-indicator');
      if (!el) return;
      const pending = this.pendingCount();
      const offline = !navigator.onLine;
      if (!offline && pending === 0) {
        el.style.display = 'none';
        return;
      }
      el.style.display = 'flex';
      el.style.background = offline ? '#FEF3C7' : '#DBEAFE';
      el.style.color = offline ? '#92400E' : '#1E40AF';
      el.textContent = offline
        ? `📴 Offline — ${pending} naghihintay i-sync (pending sync)`
        : (this.isSyncing ? `🔄 Nagsi-sync… (${pending})` : `⏳ ${pending} naghihintay i-sync (pending sync)`);
    },

    // --------------------------------------------------------------------------
    // Children Registry API
    // --------------------------------------------------------------------------
    async getChildren(barangay = null) {
      if (this.isAvailable) {
        try {
          let url = `${this.baseUrl}/children`;
          if (barangay && barangay !== 'All Barangays') {
            url += `?barangay=${encodeURIComponent(barangay)}`;
          }
          const res = await fetch(url);
          if (res.ok) return await res.json();
        } catch (e) {
          console.warn('API getChildren failed, falling back to local cache:', e);
        }
      }
      return typeof NutriStorage !== 'undefined' ? NutriStorage.getChildren() : [];
    },

    async saveChild(childData) {
      const data = await this.send('POST', '/children', childData, childData.id ? 'child-new-' + childData.id : null);
      return data || childData;
    },

    async updateChild(childData) {
      if (!childData || !childData.id) return childData;
      const data = await this.send('PUT', `/children/${encodeURIComponent(childData.id)}`, childData, 'child-upd-' + childData.id);
      return data || childData;
    },

    async deleteChild(childId) {
      if (!childId) return true;
      await this.send('DELETE', `/children/${encodeURIComponent(childId)}`, undefined, 'child-del-' + childId);
      return true;
    },

    // --------------------------------------------------------------------------
    // Monthly Reports API
    // --------------------------------------------------------------------------
    async getReports() {
      if (this.isAvailable) {
        try {
          const res = await fetch(`${this.baseUrl}/reports`);
          if (res.ok) return await res.json();
        } catch (e) {
          console.warn('API getReports error:', e);
        }
      }
      return typeof NutriStorage !== 'undefined' ? NutriStorage.getReports() : [];
    },

    async submitReport(reportData) {
      const data = await this.send('POST', '/reports', reportData, reportData.reportId ? 'report-' + reportData.reportId : null);
      return data || reportData;
    },

    // --------------------------------------------------------------------------
    // Announcements API
    // --------------------------------------------------------------------------
    async getAnnouncements() {
      if (this.isAvailable) {
        try {
          const res = await fetch(`${this.baseUrl}/announcements`);
          if (res.ok) return await res.json();
        } catch (e) {
          console.warn('API getAnnouncements error:', e);
        }
      }
      return typeof NutriStorage !== 'undefined' ? NutriStorage.getAnnouncements() : [];
    },

    async createAnnouncement(annData) {
      const data = await this.send('POST', '/announcements', annData, annData.id ? 'ann-' + annData.id : null);
      return data || annData;
    },

    async deleteAnnouncement(annId) {
      if (!annId) return true;
      await this.send('DELETE', `/announcements/${encodeURIComponent(annId)}`, undefined, 'ann-del-' + annId);
      return true;
    },

    // --------------------------------------------------------------------------
    // "Try It at Home" activity logs (ERD: ACTIVITY_LOG)
    // --------------------------------------------------------------------------
    async saveActivityLog(entry) {
      if (!entry || !entry.id) return entry;
      const data = await this.send('POST', '/activity-logs', entry, 'activity-' + entry.id);
      return data || entry;
    },

    // --------------------------------------------------------------------------
    // User Accounts API
    // --------------------------------------------------------------------------
    async getUsers() {
      if (this.isAvailable) {
        try {
          const res = await fetch(`${this.baseUrl}/users`);
          if (res.ok) return await res.json();
        } catch (e) {
          console.warn('API getUsers error:', e);
        }
      }
      return typeof NutriStorage !== 'undefined' ? NutriStorage.getUsers() : [];
    },

    async saveUser(userData) {
      if (!userData) return userData;
      const data = await this.send('POST', '/users', userData, userData.id ? 'user-' + userData.id : null);
      return data || userData;
    },

    // Server-side password check for accounts that have no hash on this device.
    // Returns { success, user?, message? } or null when the backend is unreachable.
    async login(email, password, role) {
      if (!this.isAvailable) return null;
      try {
        const res = await fetch(`${this.baseUrl}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password, role })
        });
        const data = await res.json().catch(() => ({}));
        if (res.ok && data && data.user) return { success: true, user: data.user };
        return { success: false, message: data.detail || null };
      } catch (e) {
        console.warn('API login error:', e);
        return null;
      }
    }
  };

  // Reconnection handling: flush the outbox when the phone comes back online
  window.addEventListener('online', () => NutriApi.checkHealth());
  window.addEventListener('offline', () => {
    NutriApi.isAvailable = false;
    NutriApi.updateSyncIndicator();
  });
  // Safety net for flaky rural connections where the 'online' event is unreliable
  setInterval(() => {
    if (NutriApi.pendingCount() > 0 && navigator.onLine) NutriApi.checkHealth();
  }, 60 * 1000);
  document.addEventListener('DOMContentLoaded', () => NutriApi.updateSyncIndicator());

  // Perform initial health check
  NutriApi.checkHealth();

})();
