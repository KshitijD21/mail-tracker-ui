# Mail Tracker Chrome Extension

A Chrome extension that tracks email opens in Gmail with React TypeScript popup.

## Features

- 🔐 **Authentication System**: Mock login with demo accounts
- 📧 **Email Tracking**: Automatically inject tracking pixels
- 🎨 **Modern UI**: React + TypeScript popup with beautiful design
- 💾 **Persistent State**: Chrome storage for auth persistence
- 🔄 **Real-time Updates**: Communication between popup and content script

## Demo Accounts

Use these accounts to test the extension:

- **john@example.com** / password123
- **jane@example.com** / password456
- **demo@mailtracker.com** / demo123

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
3. Login with demo credentials
4. Compose an email - tracking will be enabled

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
2. Login with demo credentials → Auth state saved to Chrome storage
3. Content script receives auth update → Gmail UI updated

### Tracking Implementation

- Content script intercepts Gmail send button
- Generates tracking ID and injects pixel
- Only works when user is authenticated

### Tech Stack

- React 19 + TypeScript
- Vite (popup build) + tsup (extension build)
- Chrome Extensions Manifest V3
- Chrome Storage API for persistence

## Customization

### Add New Demo Users

Edit `popup-src/src/services/auth.ts`:

```typescript
const MOCK_USERS: MockUser[] = [
  // Add new user here
];
```

### Modify UI Styling

Edit `popup-src/src/index.css` for visual changes.

### Backend Integration

Replace mock auth in `auth.ts` with real API calls.

## Troubleshooting

- **Build fails**: Ensure Node.js 16+ installed
- **Extension won't load**: Check manifest.json paths
- **Gmail not working**: Content script requires page reload after install
- **Popup issues**: Check browser console for React errors
