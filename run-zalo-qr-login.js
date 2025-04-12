const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');
const os = require('os');

// Get the path to the HTML file
const htmlFilePath = path.join(process.cwd(), 'zalo-qr-login.html');

// Check if the file exists
if (!fs.existsSync(htmlFilePath)) {
  console.error(`QR login page not found at ${htmlFilePath}`);
  process.exit(1);
}

// Get the URL to open
const url = `file://${htmlFilePath}`;

// Open the URL in the default browser
const command = os.platform() === 'win32'
  ? `start "" "${url}"`
  : os.platform() === 'darwin'
    ? `open "${url}"`
    : `xdg-open "${url}"`;

console.log(`Opening Zalo QR Login page at: ${url}`);
exec(command, (error) => {
  if (error) {
    console.error(`Error opening browser: ${error.message}`);
    process.exit(1);
  }
  console.log('Browser opened successfully');
});
