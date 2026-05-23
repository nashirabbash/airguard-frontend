# AirGuard Frontend

A real-time indoor air quality monitoring dashboard built with **React + TypeScript + Vite**.  
It connects to the [AirGuard Backend](https://github.com/nashirabbash/airguard-backend) over REST and WebSocket.

---

## Prerequisites

| Tool | Version |
|------|---------|
| Node.js | ≥ 18 |
| npm | ≥ 9 |
| AirGuard Backend | running on `http://localhost:3000` |

---

## Running Locally (Frontend + Backend Together)

### 1. Start the backend

```bash
cd airguard-backend
bun install         # or npm install
bun run dev         # starts Elysia on http://localhost:3000
```

### 2. Start the frontend

```bash
cd airguard-frontend   # this repo
npm install
npm run dev            # starts Vite dev server on http://localhost:5173
```

Open `http://localhost:5173` in your browser.

> The Vite dev server automatically proxies:
> - **`/api/*`** → `http://localhost:3000/api/*` (REST)
> - **`/ws/*`** → `ws://localhost:3000/ws/*` (WebSocket)
>
> No CORS configuration or env-var changes are required during development.

---

## Development Proxy Configuration

The proxy rules are declared in [`vite.config.ts`](./vite.config.ts):

```ts
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:3000',
      changeOrigin: true,
    },
    '/ws': {
      target: 'ws://localhost:3000',
      ws: true,
      changeOrigin: true,
    },
  },
},
```

All REST calls made by the frontend use the `/api` path prefix.  
The dashboard WebSocket connects to `/ws/dashboard` which is transparently upgraded through the proxy.

---

## Manual Integration Walkthrough

Follow these steps to verify the full end-to-end flow after starting both services.

### Step 1 — Sign up

On the login screen, switch to **Sign Up**, enter a username and password, and submit.  
The backend stores a hashed password and returns a session token.

```
POST /api/auth/signup  { username, password }
→ 201 { data: { token } }
```

### Step 2 — Log in

Use the **Login** form with the same credentials.  
The session token is stored in Redux and persisted to `sessionStorage`.

```
POST /api/auth/login  { username, password }
→ 200 { data: { token } }
```

### Step 3 — Create a device

Click **TAMBAH PERANGKAT** to open the device configuration modal.  
Fill in the **Device ID** (a free-form string, e.g. `esp32-room-1`) and the threshold values.

```
POST /api/device/register
Authorization: Bearer <token>
Body: { deviceId, tempUnsafeHigh, tempUnsafeLow, tempWarningHigh, tempWarningLow,
        humidityUnsafeHigh, humidityUnsafeLow, humidityWarningHigh, humidityWarningLow,
        mq135BaselineRuntimeOnly }
→ 201 { data: { deviceId, ... } }
```

> **Device token policy:** The current backend implementation uses the **Device ID itself** as the device token.  
> When simulating a sensor reading over WebSocket, use the Device ID as the `token` field.

### Step 4 — Select the device

If you have only one device, it is selected automatically.  
If you have multiple devices, choose one from the device selector screen.

### Step 5 — Ingest sensor data (simulate a device)

Use a WebSocket client (e.g. `wscat`, Postman, or a custom script) to push a reading:

```bash
wscat -c ws://localhost:3000/ws/ingest
```

Send a `sensor_reading` message:

```json
{
  "type": "sensor_reading",
  "device_id": "esp32-room-1",
  "token": "esp32-room-1",
  "timestamp": "2026-05-23T10:00:00.000Z",
  "temperature": 28.5,
  "humidity": 65.0,
  "mq135_value": 120
}
```

The backend validates the token, computes the `room_status`, stores the reading, and broadcasts a `telemetry_reading` message to all connected dashboard clients.

### Step 6 — View the dashboard update

Return to the browser. The sensor cards should update within milliseconds showing the temperature, humidity, and gas level. The status badge (`AMAN` / `WASPADA` / `BAHAYA`) reflects the value computed by the backend.

---

## Integration Contracts

### REST API base

All REST endpoints are prefixed with `/api`:

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/api/auth/signup` | Register a new user |
| `POST` | `/api/auth/login` | Login; returns session token |
| `POST` | `/api/auth/logout` | Invalidate session token |
| `GET`  | `/api/auth/users/:id` | Get current user profile |
| `POST` | `/api/device/register` | Register a device |
| `PUT`  | `/api/device/:deviceId` | Update device thresholds |
| `GET`  | `/api/device/user/:userId` | List devices for a user |
| `DELETE` | `/api/device/delete?deviceId=` | Delete a device |

Authentication uses the `Authorization: Bearer <token>` header.

### WebSocket endpoints

| Path | Direction | Description |
|------|-----------|-------------|
| `ws://host/ws/dashboard` | Backend → Frontend | Receive snapshots and live telemetry |
| `ws://host/ws/ingest`    | Device → Backend   | Push raw sensor readings |

#### Dashboard WebSocket messages

After connecting to `/ws/dashboard`, the frontend sends:

```json
{ "type": "subscribe", "token": "<session-token>", "device_id": "<deviceId>" }
```

The backend responds with an initial snapshot:

```json
{ "type": "snapshot", "current": { "device_id", "timestamp", "temperature", "humidity", "mq135_value", "room_status" } }
```

`current` is `null` when the device has no readings yet. Live updates arrive as:

```json
{ "type": "telemetry_reading", "data": { "device_id", "timestamp", "temperature", "humidity", "mq135_value", "room_status" } }
```

### Room status ownership

> **Room status is entirely owned by the backend.**  
> The frontend never computes room status from sensor thresholds.  
> It only maps the backend string values to display labels:
>
> | Backend value | UI label |
> |---------------|----------|
> | `normal`      | `AMAN`   |
> | `warning`     | `WASPADA`|
> | `danger`      | `BAHAYA` |

### Device token policy

> The current device token policy uses the **Device ID as the token**.  
> When a physical device (or simulator) sends a `sensor_reading` message to `/ws/ingest`,  
> the `token` field must equal the `device_id`.  
> The backend stores a SHA-256 hash of this token and validates each ingested reading against it.

---

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with HMR |
| `npm run build` | TypeScript compile + Vite production bundle |
| `npm run lint` | ESLint static analysis |
| `npm run preview` | Preview the production build locally |

---

## Tech Stack

- **React 19** + **TypeScript**
- **Vite 8** (dev server + bundler)
- **Redux Toolkit** — client state (auth token, selected device)
- **TanStack Query** — server state (devices CRUD, profile)
- **Vanilla CSS Modules** — component-scoped styles
