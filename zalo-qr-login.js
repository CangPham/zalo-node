const { Zalo } = require('zca-js');
const fs = require('fs');
const path = require('path');

// Create output directory if it doesn't exist
const outputDir = path.join(__dirname, 'output');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir);
}

// Initialize Zalo
const zalo = new Zalo();

// Start QR login process
console.log('Starting Zalo QR login process...');
zalo.loginQR({
  onQR: (event) => {
    console.log('Received QR event type:', event.type);

    if (event.type === 0 && event.data && event.data.image) {
      // QR code generated
      const qrCodeDataUrl = event.data.image;

      // Save QR code to output directory
      const qrCodeOutputPath = path.join(outputDir, 'zalo-qr-code.png');
      fs.writeFileSync(qrCodeOutputPath, Buffer.from(qrCodeDataUrl, 'base64'));
      console.log('QR code saved to output directory:', qrCodeOutputPath);

      // Also save to root directory for compatibility
      fs.writeFileSync('qr.png', Buffer.from(qrCodeDataUrl, 'base64'));
      console.log('QR code also saved to:', path.join(__dirname, 'qr.png'));

      console.log('Please scan the QR code with your Zalo app');
    } else if (event.type === 1) {
      // QR code scanned
      console.log('QR code scanned. Waiting for confirmation...');
    } else if (event.type === 2) {
      // Login successful
      console.log('Login successful!');

      try {
        // Get credentials
        const cookie = zalo.getCookie();
        const imei = zalo.getImei();
        const userAgent = zalo.getUserAgent();

        console.log('Credentials obtained:');
        console.log('Cookie:', cookie ? 'obtained' : 'missing');
        console.log('IMEI:', imei ? 'obtained' : 'missing');
        console.log('User Agent:', userAgent ? 'obtained' : 'missing');

        // Save credentials to file
        const credentialsPath = path.join(outputDir, 'zalo-credentials.json');
        fs.writeFileSync(credentialsPath, JSON.stringify({ cookie, imei, userAgent }, null, 2));

        console.log('Credentials saved to:', credentialsPath);
      } catch (error) {
        console.error('Error getting credentials:', error);
      }

      process.exit(0);
    } else if (event.type === 3) {
      // QR code expired
      console.log('QR code expired. Please try again.');
      process.exit(1);
    }
  },
  onError: (error) => {
    console.error('Error in QR login:', error);
    process.exit(1);
  },
});

// Keep the process running
console.log('Waiting for QR code scan...');
