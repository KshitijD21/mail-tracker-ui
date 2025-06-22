# Mail Tracker Extension - Setup Instructions

## Testing the Extension

1. **Load the Extension in Chrome:**

   - Open Chrome and go to `chrome://extensions/`
   - Enable "Developer mode" (toggle in top right)
   - Click "Load unpacked"
   - Select the `mail-tracker-extension` folder

2. **Test the Popup:**

   - Click the extension icon in the toolbar
   - You should see a login popup

3. **Demo Credentials:**

   - Email: `demo@mailtracker.com`
   - Password: `demo123`

   OR

   - Email: `john@example.com`
   - Password: `password123`

4. **Test Flow:**
   - Go to Gmail (mail.google.com)
   - Click the extension icon and login
   - Compose a new email
   - You should see a "📧 Tracking ON" button in the compose toolbar
   - The extension will only show tracking features when logged in

## Features

- **Popup Login:** Modern login interface with mock authentication
- **Auth State Management:** Persistent login state using Chrome storage
- **Content Script Integration:** Tracking features only available when authenticated
- **Gmail Integration:** Seamless integration with Gmail compose window

## Development

- The extension uses TypeScript with `tsup` for building
- Run `npx tsup` in the extension folder to rebuild
- Popup HTML/CSS is in `popup/` folder
- Content script logic is in `src/scripts/content.ts`
