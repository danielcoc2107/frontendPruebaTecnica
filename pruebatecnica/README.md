# Frontend Prueba Tecnica - Red Social

Frontend en React + TypeScript para consumir el backend local en `http://localhost:8080`.

## Stack
- React 19 + TypeScript estricto
- Vite
- Zustand
- Fetch API con cliente centralizado
- STOMP + SockJS para likes en tiempo real
- Vitest

## Estructura
```text
src/
  api/
  app/
  components/
  features/
    login/
    feed/
    profile/
  lib/
  store/
  types/
  ws/
```

## Variables de entorno
Crea `.env` tomando `.env.example`:
```bash
VITE_API_BASE_URL=http://localhost:8080
VITE_WS_URL=http://localhost:8080/ws
```

## Ejecutar local
```bash
npm install
npm run dev
```

Rutas:
- `/login`
- `/feed` (protegida)
- `/profile` (protegida)

## Build y tests
```bash
npm run build
npm run test
```

## Docker
```bash
docker build -t redsocial-frontend .
docker run --rm -p 8081:80 redsocial-frontend
```

## Notas de errores
- `POST /api/auth/login` responde `400` en credenciales invalidas.
- `GET /api/users/me` puede responder `400` si no encuentra usuario.
- `401/403` fuerzan logout y redireccion a `/login`.
- Se envia `X-Correlation-Id` en todas las requests.
- Se adjunta `Authorization: Bearer <token>` en endpoints protegidos.

## Realtime likes
- Handshake WS: `VITE_WS_URL` (default `http://localhost:8080/ws`).
- Headers `CONNECT`: `Authorization` y `X-Correlation-Id`.
- Topic por post: `/topic/posts/{postId}/likes`.
- Toggle WS: `/app/likes/toggle`.
- Fallback HTTP: `POST /api/likes/toggle` si WS no conecta.
