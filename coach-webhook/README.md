# Coach Webhook Server

Simple Go-based webhook server for receiving Telegram bot events for Coach SaaS.

## Features

- ✅ HTTP server listening on port 8080 (easily switchable to HTTPS)
- ✅ Webhook endpoint at `/webhook` accepting POST JSON requests
- ✅ Event routing:
  - Regular messages (e.g., `/coach` command)
  - Button callbacks (inline menu button presses)
  - Inline queries
- ✅ Request logging for debugging
- ✅ Health check endpoint at `/health`

## Quick Start

### 1. Start the server (HTTP mode for testing)

```bash
cd /root/.openclaw/workspace-coach/coach-webhook
export PATH=$PATH:/usr/local/go/bin
go run main.go
```

The server will start on `http://0.0.0.0:8080`

### 2. Test with curl

**Test basic connectivity:**
```bash
curl http://localhost:8080/health
```

**Test webhook with /coach command:**
```bash
curl -X POST http://localhost:8080/webhook \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://coach.bot.mxjxn.com/webhook",
    "message": {
      "message": {
        "text": "/coach",
        "chat_id": 123456789
      }
    }
  }'
```

**Test button callback:**
```bash
curl -X POST http://localhost:8080/webhook \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://coach.bot.mxjxn.com/webhook",
    "message": {
      "callback_query": "view_goals",
      "user_id": 123456789
    }
  }'
```

**Test inline query:**
```bash
curl -X POST http://localhost:8080/webhook \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://coach.bot.mxjxn.com/webhook",
    "message": {
      "inline_query": {
        "query": "goals",
        "user_id": 123456789
      }
    }
  }'
```

## Webhook Payload Format

```json
{
  "url": "https://your-domain.com/webhook",
  "message": {
    // Event-specific data
    // For regular messages:
    "message": {
      "text": "/coach",
      "chat_id": 123456789
    }
    // For button callbacks:
    "callback_query": "view_goals",
    // For inline queries:
    "inline_query": {
      "query": "goals",
      "user_id": 123456789
    }
  }
}
```

## Event Types Handled

### 1. Regular Messages
- `/coach` command → Triggers inline menu display
- Other text → Logged for debugging

### 2. Button Callbacks
- `start_coach` → Start Coach flow
- `view_goals` → View user's goals
- `add_goal` → Add new goal
- `view_tasks` → View tasks
- `add_task` → Add new task

### 3. Inline Queries
- Search/query from inline keyboard

## Server Responses

### Success Response (200 OK)
```json
{
  "status": "success",
  "message": "Webhook processed successfully"
}
```

### Error Response
```json
{
  "status": "error",
  "message": "Error description"
}
```

## Health Check

```bash
curl http://localhost:8080/health
```

Response:
```json
{
  "status": "healthy",
  "service": "Coach Webhook Server",
  "version": "1.0.0",
  "uptime": "0s",
  "requests": 5
}
```

## HTTPS Setup (Production)

### 1. Generate self-signed certificate

```bash
cd /root/.openclaw/workspace-coach/coach-webhook
openssl req -newkey rsa:2048 \
  -keyout webhook.key \
  -out webhook.crt \
  -days 365 \
  -subj "/CN=coach.bot.mxjxn.com"
```

### 2. Update main.go for HTTPS

Replace `server.ListenAndServe()` with:

```go
log.Fatal(server.ListenAndServeTLS("webhook.crt", "webhook.key"))
```

### 3. Start with HTTPS

```bash
go run main.go
```

The server will start on `https://0.0.0.0:8443` (update `Addr` in main.go first)

## Next Steps

Once the webhook server is working:

1. **Integrate with Telegram Bot API** - Send messages back to users
2. **Connect to Coach Service** - Route events to backend logic
3. **Add inline keyboard** - Send buttons for user interaction
4. **Configure Telegram Webhook** - Point Telegram bot to this server

## Project Structure

```
coach-webhook/
├── main.go          # Main server code
├── go.mod           # Go module definition
├── README.md        # This file
├── webhook.key      # SSL private key (generated)
└── webhook.crt      # SSL certificate (generated)
```

## Architecture Context

This webhook server is the **event receiving layer** for Coach SaaS. It:

1. Receives events from Telegram Bot API
2. Parses and routes events
3. Logs all events for debugging
4. Will forward events to Coach backend service (future)

Full architecture: see `memory/coach-service-project.md`
