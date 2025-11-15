# WhatsApp Spend Tracker

A Node.js webhook server that receives WhatsApp messages and automatically logs expenses to Google Sheets.

## Features

- Receives WhatsApp messages via webhook
- Parses text messages for expense data (item, price, comment)
- Automatically sends expense data to Google Sheets
- Handles message status updates (sent, delivered, read, failed, deleted)
- Webhook verification for WhatsApp Cloud API

## Project Structure

```
spend_tracker/
├── controllers/
│   ├── webhook_handler.js    # Main webhook logic and Google Sheets integration
│   └── webhook_verify.js     # WhatsApp webhook verification
├── routes/
│   └── index.js             # API route definitions
├── tests/
│   ├── webhook_handler.test.js  # Unit tests for webhook handler
│   ├── webhook_verify.test.js   # Unit tests for webhook verification
│   └── routes.test.js          # Unit tests for routes
├── index.js                 # Express server setup
├── package.json             # Dependencies and scripts
├── jest.config.js           # Jest test configuration
└── .env                     # Environment variables
```

## Setup

### Prerequisites
- Node.js installed
- WhatsApp Business API access
- Google Apps Script for Sheets integration

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables in `.env`:
   ```
   GOOGLEWEBAPPURL=your_google_apps_script_url
   PORT=3001
   VERIFY_WEBHOOK_TOKEN=your_webhook_verification_token
   ```

4. Install dev dependencies for testing:
   ```bash
   npm install --save-dev jest supertest
   ```

5. Start the server:
   ```bash
   node index.js
   ```

## Usage

### Message Format
Send WhatsApp messages in this format:
```
Item Name
Price
Optional Comment
```

Example:
```
Coffee
5.50
Morning coffee at Starbucks
```

### API Endpoints

- `GET /webhook` - Webhook verification for WhatsApp
- `POST /webhook` - Receives WhatsApp messages and processes expenses

## Environment Variables

| Variable | Description |
|----------|-------------|
| `GOOGLEWEBAPPURL` | Google Apps Script URL for Sheets integration |
| `PORT` | Server port (default: 3001) |
| `VERIFY_WEBHOOK_TOKEN` | Token for WhatsApp webhook verification |

## Dependencies

### Production
- `express` - Web framework
- `body-parser` - Parse request bodies
- `cors` - Enable CORS
- `dotenv` - Environment variable management
- `localtunnel` - Local development tunneling

### Development
- `jest` - Testing framework
- `supertest` - HTTP testing library

## How It Works

1. WhatsApp sends messages to the webhook endpoint
2. Server verifies the message type is "text"
3. Parses message content for expense data
4. Sends structured data to Google Sheets via Apps Script
5. Returns appropriate status responses

## Testing

Run tests using these commands:

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage report
npm run test:coverage
```

## Google Sheets Integration

The app sends expense data in this format:
```json
{
  "date": "2024-01-15",
  "item": "Coffee",
  "price": "5.50",
  "comment": "Morning coffee at Starbucks"
}
```