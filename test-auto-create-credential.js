// Test script to verify that the auto-create-zalo-credential.js script works correctly
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

console.log('=== Testing Auto-Create Zalo Credential Script ===');

// Create a sample credential info file
const outputDir = path.join(process.cwd(), 'output');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const credentialInfoPath = path.join(outputDir, 'zalo-credential-info.json');
const credentialData = {
  type: 'zaloApi',
  name: 'Test Zalo API Credentials',
  data: {
    cookie: 'test-cookie',
    imei: 'test-imei',
    userAgent: 'test-user-agent',
    proxy: '',
    supportCode: 'ab4a204fe0fc4493d0739ab00a084849054365d9d252cb3c943ed756d577d6469',
    licenseKey: ''
  }
};

// Write the credential info file
fs.writeFileSync(credentialInfoPath, JSON.stringify(credentialData, null, 2));
console.log(`Created test credential info file at ${credentialInfoPath}`);

// Execute the auto-create-zalo-credential.js script
console.log('Executing auto-create-zalo-credential.js...');
const scriptProcess = spawn('node', ['auto-create-zalo-credential.js'], {
  detached: true,
  stdio: 'inherit'
});

// Wait for the script to complete
scriptProcess.on('exit', (code) => {
  console.log(`Script exited with code ${code}`);
  
  // Check if the credential info file was renamed (indicating success)
  if (!fs.existsSync(credentialInfoPath)) {
    console.log('Test PASSED: Credential info file was renamed, indicating successful credential creation');
  } else {
    console.log('Test FAILED: Credential info file still exists, indicating credential creation failed');
  }
});
