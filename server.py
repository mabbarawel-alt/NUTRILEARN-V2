import http.server
import os
import socketserver
import sys

PORT = 8089
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# Values from .env that the browser may see. Everything else in .env
# (e.g. SUPABASE_SERVICE_KEY) is never sent.
PUBLIC_ENV_KEYS = ("SUPABASE_URL", "SUPABASE_ANON_KEY", "ENVIRONMENT")

# Files that must never be downloadable from this dev server
PRIVATE_FILES = {"local_db.json"}
PRIVATE_EXTENSIONS = {".py", ".ps1", ".bat", ".sql", ".yaml", ".txt", ".md"}


def read_public_env() -> str:
    values = {}
    env_path = os.path.join(BASE_DIR, ".env")
    if os.path.isfile(env_path):
        with open(env_path, encoding="utf-8") as f:
            for line in f:
                line = line.strip()
                if not line or line.startswith("#") or "=" not in line:
                    continue
                key, value = line.split("=", 1)
                values[key.strip()] = value.strip()
    return "".join(f"{k}={values.get(k, '')}\n" for k in PUBLIC_ENV_KEYS)


class NoCacheHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=BASE_DIR, **kwargs)

    def end_headers(self):
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        super().end_headers()

    def _is_private(self) -> bool:
        path = self.path.split("?", 1)[0].split("#", 1)[0]
        parts = [p for p in path.split("/") if p]
        if any(p.startswith(".") for p in parts):
            return True
        name = parts[-1].lower() if parts else ""
        return name in PRIVATE_FILES or os.path.splitext(name)[1] in PRIVATE_EXTENSIONS

    def do_GET(self):
        if self.path.split("?", 1)[0] == "/.env":
            body = read_public_env().encode("utf-8")
            self.send_response(200)
            self.send_header("Content-Type", "text/plain; charset=utf-8")
            self.send_header("Content-Length", str(len(body)))
            self.end_headers()
            self.wfile.write(body)
            return
        if self._is_private():
            self.send_error(404)
            return
        super().do_GET()

    def do_HEAD(self):
        if self._is_private() or self.path.split("?", 1)[0] == "/.env":
            self.send_error(404)
            return
        super().do_HEAD()

    def list_directory(self, path):
        # No folder listings
        self.send_error(404)
        return None

    def log_message(self, format, *args):
        # Concise logging
        sys.stderr.write(f"[{self.log_date_time_string()}] {args[0]} {args[1]}\n")


class ThreadingServer(socketserver.ThreadingMixIn, socketserver.TCPServer):
    allow_reuse_address = True
    daemon_threads = True


if __name__ == '__main__':
    with ThreadingServer(('0.0.0.0', PORT), NoCacheHandler) as httpd:
        print(f"NutriLearn Dev Server running at http://localhost:{PORT}/")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nShutting down server.")
