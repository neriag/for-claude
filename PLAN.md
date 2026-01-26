# WhatsApp Mirror Bot - Implementation Plan

## Overview

A WhatsApp bot that receives messages and responds with "you wrote: {message}". Built using the official WhatsApp Cloud API (Meta Business Platform).

## Architecture

```
┌─────────────┐     ┌─────────────────┐     ┌──────────────────┐
│   User's    │────▶│  Meta/WhatsApp  │────▶│  Your Webhook    │
│   Phone     │     │  Cloud Platform │     │  Server (Express)│
└─────────────┘     └─────────────────┘     └──────────────────┘
                            │                        │
                            │◀───────────────────────┘
                            │   (Send reply via API)
                            ▼
                    ┌─────────────────┐
                    │  Bot Phone      │
                    │  Number         │
                    └─────────────────┘
```

## How It Works

1. **User sends message** to the bot's WhatsApp number
2. **Meta receives the message** and forwards it to your webhook URL
3. **Your server processes** the incoming webhook (message data in JSON)
4. **Your server calls** the WhatsApp Cloud API to send a reply
5. **User receives** "you wrote: {their message}"

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js (for webhook server)
- **API**: WhatsApp Cloud API (official Meta API)
- **Deployment**: Any server with HTTPS (Heroku, Railway, Render, VPS, etc.)

## Project Structure

```
whatsapp-mirror-bot/
├── src/
│   ├── index.js          # Entry point, Express server
│   ├── webhook.js        # Webhook route handlers
│   ├── whatsapp.js       # WhatsApp API client
│   └── messageHandler.js # Business logic (mirroring)
├── .env.example          # Environment variables template
├── package.json
└── README.md             # Setup instructions
```

## Setup Requirements

### 1. Meta Business Account Setup
- Create a Meta Developer account at https://developers.facebook.com
- Create a new App (type: Business)
- Add WhatsApp product to your app
- Get a test phone number (free) or add your own business number

### 2. Required Credentials
- **Phone Number ID**: Identifies your WhatsApp business number
- **Access Token**: For authenticating API calls
- **Verify Token**: A secret string you create for webhook verification
- **App Secret**: For validating webhook signatures (optional but recommended)

### 3. Webhook Setup
- Your server must be publicly accessible via HTTPS
- Configure the webhook URL in Meta Developer Console
- Subscribe to "messages" webhook field

## Implementation Phases

### Phase 1: Basic Mirror Bot (Current)
- Receive messages via webhook
- Reply with "you wrote: {message}"
- Handle text messages

### Phase 2: Future Enhancements (Later)
- Handle media messages (images, voice, documents)
- Add conversation state/context
- Implement custom business logic
- Add logging and monitoring
- Database integration for message history

## API Endpoints

### Webhook Endpoint
```
GET  /webhook  - Verification (called once by Meta during setup)
POST /webhook  - Receive incoming messages
```

### Health Check
```
GET  /health   - Server health status
```
