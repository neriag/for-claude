# WhatsApp Mirror Bot

A WhatsApp bot that mirrors your messages back to you. When you send a message, it replies with "you wrote: {your message}".

Built using the official **WhatsApp Cloud API** from Meta.

## Quick Start

```bash
# Install dependencies
npm install

# Copy environment template and fill in your values
cp .env.example .env

# Start the server
npm start
```

## Setup Guide

### Step 1: Create a Meta Developer Account

1. Go to [Meta for Developers](https://developers.facebook.com/)
2. Log in with your Facebook account
3. Click "Get Started" if you're new

### Step 2: Create a Meta App

1. Go to [My Apps](https://developers.facebook.com/apps/)
2. Click **Create App**
3. Select **Other** as the use case
4. Select **Business** as the app type
5. Give your app a name (e.g., "WhatsApp Mirror Bot")
6. Click **Create App**

### Step 3: Add WhatsApp to Your App

1. In your app dashboard, find **WhatsApp** in the products list
2. Click **Set Up**
3. You'll be taken to the WhatsApp Getting Started page

### Step 4: Get Your Credentials

On the **API Setup** page, you'll find:

1. **Test Phone Number**: Meta provides a free test phone number you can use
2. **Phone Number ID**: A numeric ID for your WhatsApp number (e.g., `123456789012345`)
3. **Temporary Access Token**: Click "Generate" to create one (valid for 24 hours)

For production, you'll need a permanent access token:
1. Go to **Business Settings** > **System Users**
2. Create a system user with admin access
3. Generate a permanent token with `whatsapp_business_messaging` permission

### Step 5: Configure Environment Variables

Create a `.env` file:

```bash
cp .env.example .env
```

Fill in your values:

```env
PORT=3000
WHATSAPP_ACCESS_TOKEN=your_access_token_here
VERIFY_TOKEN=my_secret_verify_token_123
```

The `VERIFY_TOKEN` can be any random string you create - you'll use the same string when configuring the webhook in Meta.

### Step 6: Deploy Your Server

Your webhook must be publicly accessible via **HTTPS**. Options:

#### Option A: ngrok (for local development)
```bash
# Start your server
npm start

# In another terminal, expose it via ngrok
ngrok http 3000
```
Use the `https://xxxx.ngrok.io` URL as your webhook URL.

#### Option B: Deploy to a cloud platform

**Railway:**
```bash
# Install Railway CLI and deploy
railway login
railway init
railway up
```

**Render:**
1. Connect your GitHub repo at [render.com](https://render.com)
2. Create a new Web Service
3. Set environment variables in the dashboard

**Heroku:**
```bash
heroku create my-whatsapp-bot
heroku config:set WHATSAPP_ACCESS_TOKEN=xxx VERIFY_TOKEN=xxx
git push heroku main
```

### Step 7: Configure the Webhook in Meta

1. Go to your app in [Meta Developer Console](https://developers.facebook.com/apps/)
2. Navigate to **WhatsApp** > **Configuration**
3. Under **Webhook**, click **Edit**
4. Enter your webhook URL: `https://your-domain.com/webhook`
5. Enter your **Verify Token** (same as in your `.env` file)
6. Click **Verify and Save**

After verification, subscribe to webhook fields:
1. Click **Manage** next to Webhook fields
2. Enable **messages** (this is required to receive messages)

### Step 8: Add a Test Number

1. Go to **WhatsApp** > **API Setup**
2. Under "To", add your personal phone number
3. Click **Send Message** to verify (you'll receive a template message)

Now you can send messages to the test number and receive mirrored replies!

## Testing

1. Send a WhatsApp message to your bot's phone number
2. You should receive a reply: "you wrote: {your message}"

Check server logs for debugging:
```bash
npm start
# Watch for "Received message from..." logs
```

## Project Structure

```
├── src/
│   ├── index.js          # Express server entry point
│   ├── webhook.js        # Webhook verification & event handling
│   ├── whatsapp.js       # WhatsApp API client (sending messages)
│   └── messageHandler.js # Business logic (mirror messages)
├── .env.example          # Environment variables template
├── package.json
├── PLAN.md               # Architecture documentation
└── README.md
```

## Adding Custom Logic

Edit `src/messageHandler.js` to add your own logic:

```javascript
async function handleIncomingMessage(message, metadata) {
  const from = message.from;
  const phoneNumberId = metadata.phone_number_id;

  if (message.type === 'text') {
    const userMessage = message.text.body;

    // Add your custom logic here!
    let reply;
    if (userMessage.toLowerCase() === 'hello') {
      reply = 'Hi there! How can I help you?';
    } else {
      reply = `you wrote: ${userMessage}`;
    }

    await sendTextMessage(from, reply, phoneNumberId);
  }
}
```

## Troubleshooting

### Webhook verification fails
- Ensure your `VERIFY_TOKEN` matches in both `.env` and Meta Console
- Check that your server is accessible via HTTPS
- Look at server logs for error details

### Messages not being received
- Verify you subscribed to the "messages" webhook field
- Check that the sending number is added as a test number
- Ensure your access token hasn't expired

### API errors when sending replies
- Check that `WHATSAPP_ACCESS_TOKEN` is set correctly
- Verify the token has `whatsapp_business_messaging` permission
- For test numbers, ensure the recipient has been added and verified

## Going to Production

For production use:

1. **Permanent Access Token**: Create a System User and generate a permanent token
2. **Your Own Phone Number**: Add a real business phone number instead of the test number
3. **Business Verification**: Complete Meta's business verification process
4. **Message Templates**: For initiating conversations, you'll need approved templates

See [WhatsApp Business Platform Documentation](https://developers.facebook.com/docs/whatsapp/cloud-api) for details.
