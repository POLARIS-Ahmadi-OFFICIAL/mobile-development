# mobile-development

POLARIS mobile client (Expo 56 + NativeWind).

## Setup

```bash
npm install
npm start
```

Configure in `app.json` → `expo.extra`:

- `apiUrl` — backend (`http://127.0.0.1:8080` by default; Android emulator falls back to `http://10.0.2.2:8080`; physical devices need your machine's LAN IP)
- `supabaseUrl` / `supabaseAnonKey` — for GitHub sign-in

## Auth (GitHub via Supabase)

The app opens **`/login`** first. Use **Continue without auth (dev)** to reach the main tabs without Supabase.

1. Enable **GitHub** in Supabase Auth providers.
2. Add redirect URL from the login screen (typically `polaris://auth/callback` or Expo dev URI).
3. **Continue with GitHub** on the login screen.

## LLM settings

Settings → General: choose **Qwen** (Hugging Face) or **Google Gemini**, pick a model, and save your API key to the backend.

## Run full stack (API + web + mobile)

From [web-frontend](../web-frontend):

```bash
npm run dev:stack
```

Requires `backend-api/.venv` with `pip install -e ".[dev]"`.

## EAS

```bash
npx eas-cli build --profile preview
```

Configure `extra.eas.projectId` in `app.json` after `eas init`.
