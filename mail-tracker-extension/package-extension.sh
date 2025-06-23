#!/bin/bash

# Build both popup and extension
npm run build

# Create a zip file for Chrome extension
zip -r mail-tracker-extension.zip \
  manifest.json \
  dist/ \
  popup/dist/ \
  icons/ \
  -x "*.DS_Store" "*.git*"

echo "Extension packaged as mail-tracker-extension.zip"
echo ""
echo "To install:"
echo "1. Open Chrome and go to chrome://extensions/"
echo "2. Enable 'Developer mode'"
echo "3. Click 'Load unpacked' and select this directory"
echo "4. Or drag and drop the mail-tracker-extension.zip file"
