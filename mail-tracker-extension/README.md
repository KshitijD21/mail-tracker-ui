# Mail Tracker Chrome Extension

A Chrome extension that tracks email opens in Gmail with React TypeScript popup.

## Features

- 🔐 **Authentication System**: Real API-based authentication
- 📧 **Email Tracking**: Automatically inject tracking pixels when sending emails
- 🤖 **AI Reply**: Generate AI-powered replies to emails
- 🎨 **Modern UI**: React + TypeScript popup with beautiful design
- 💾 **Persistent State**: Chrome storage for auth persistence
- 🔄 **Real-time Updates**: Communication between popup and content script

## AI Reply Feature

When you're viewing an email in Gmail and logged into the extension:

1. **AI Reply Button**: A "🤖 Reply with AI" button appears below each email
2. **Content Extraction**: Automatically extracts the email content (removing quotes and signatures)
3. **AI Processing**: Sends the email content to the backend AI service
4. **Smart Integration**:
   - Tries to open Gmail's reply composer automatically
   - Inserts the AI-generated response
   - Adds a signature indicating AI assistance
   - Falls back to a modal if auto-insertion fails
5. **User Control**: You can edit the AI response before sending

### How It Works

- Detects when emails are opened in Gmail
- Analyzes email content and removes quoted text
- Calls the `/ai/getResponse` API endpoint
- Integrates seamlessly with Gmail's compose interface
- Provides loading animations and error handling

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Build the Extension

```bash
npm run build
```

### 3. Load in Chrome

1. Open `chrome://extensions/`
2. Enable "Developer mode"
3. Click "Load unpacked" and select this directory

### 4. Test

1. Navigate to Gmail (https://mail.google.com)
2. Click the extension icon in toolbar
3. Login with your credentials or create an account
4. **Email Tracking**: Compose an email - tracking will be enabled automatically
5. **AI Reply**: Open any email and click the "🤖 Reply with AI" button to generate an AI response

## Development

### Scripts

- `npm run build` - Build both popup and extension
- `npm run build:popup` - Build React popup only
- `npm run build:extension` - Build extension scripts only
- `npm run dev:popup` - Watch popup changes
- `npm run dev:extension` - Watch extension changes

### Project Structure

```
popup-src/          # React TypeScript popup source
├── src/
│   ├── App.tsx            # Main popup component
│   ├── components/        # UI components
│   ├── services/         # Auth service
│   └── types/            # TypeScript types
src/                # Extension scripts
├── background.ts          # Service worker
└── scripts/content.ts     # Gmail content script
popup/dist/         # Built React popup
dist/              # Built extension scripts
```

## Technical Details

### Authentication Flow

1. User opens popup → React app loads
2. Login with real credentials → Auth state saved to Chrome storage
3. Content script receives auth update → Gmail UI updated

### AI Reply Implementation

1. Content script detects email views using Gmail DOM selectors
2. Injects "Reply with AI" button for authenticated users
3. Extracts email content, removing quotes and signatures
4. Calls backend AI API with email content
5. Integrates response into Gmail's compose interface

### Tracking Implementation

- Content script intercepts Gmail send button
- Generates tracking ID and injects pixel
- Only works when user is authenticated

### Tech Stack

- React 19 + TypeScript for popup
- Vite (popup build) + tsup (extension build)
- Chrome Extensions Manifest V3
- Real API integration with axios
- Chrome Storage API for persistence

## Troubleshooting

### AI Reply Not Working

1. **Authentication**: Make sure you're logged in via the extension popup
2. **API Connection**: Check browser console for network errors
3. **Gmail Detection**: The button appears below email content - look for "🤖 Reply with AI"
4. **Content Extraction**: If getting "Could not extract email content", try refreshing Gmail

### Common Issues

- **Button Not Appearing**: Make sure you're viewing an actual email (not inbox list)
- **Loading Forever**: Check if backend AI service is running
- **Reply Not Inserting**: Gmail's compose area detection can vary - use the modal fallback
- **Authentication Errors**: 403 errors indicate you need to log in again

### Debug Mode

Open browser console to see debug logs:

- Email content extraction logs
- API call results
- Button placement confirmations

### Modify UI Styling

Edit `popup-src/src/index.css` for visual changes.

### Backend Integration

Replace mock auth in `auth.ts` with real API calls.

## Troubleshooting

- **Build fails**: Ensure Node.js 16+ installed
- **Extension won't load**: Check manifest.json paths
- **Gmail not working**: Content script requires page reload after install
- **Popup issues**: Check browser console for React errors
