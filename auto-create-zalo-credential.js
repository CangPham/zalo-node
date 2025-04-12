/**
 * This script automatically creates Zalo API credentials in n8n when it starts.
 * It should be run after n8n has started.
 *
 * Usage:
 * 1. Start n8n: n8n start
 * 2. Run this script: node auto-create-zalo-credential.js
 */

const fs = require('fs');
const path = require('path');
const { createCredential } = require('./create-zalo-credential');

// Configuration
const CREDENTIAL_INFO_FILE = path.join(process.cwd(), 'output', 'zalo-credential-info.json');
const CHECK_INTERVAL = 5000; // 5 seconds
const MAX_RETRIES = 12; // 1 minute total (12 * 5 seconds)

// Function to check if n8n is running
async function checkN8nRunning() {
  try {
    const axios = require('axios');
    // Try different ports that n8n might be running on
    const ports = [5678, 5679, 8080, 3000];

    for (const port of ports) {
      try {
        await axios.get(`http://localhost:${port}/rest/settings`);
        console.log(`n8n found running on port ${port}`);
        return port;
      } catch (portError) {
        // Try next port
      }
    }

    return false;
  } catch (error) {
    return false;
  }
}

// Function to wait for n8n to start
async function waitForN8n(retries = 0) {
  if (retries >= MAX_RETRIES) {
    console.error('Timeout waiting for n8n to start. Please make sure n8n is running.');
    process.exit(1);
  }

  console.log(`Checking if n8n is running (attempt ${retries + 1}/${MAX_RETRIES})...`);

  const port = await checkN8nRunning();
  if (port) {
    console.log(`n8n is running on port ${port}!`);
    return port;
  } else {
    console.log(`n8n is not running yet. Waiting ${CHECK_INTERVAL/1000} seconds...`);
    await new Promise(resolve => setTimeout(resolve, CHECK_INTERVAL));
    return waitForN8n(retries + 1);
  }
}

// Main function
async function main() {
  console.log('=== Zalo Credential Auto-Creator ===');

  // Check if credential info file exists
  if (!fs.existsSync(CREDENTIAL_INFO_FILE)) {
    console.log(`No credential info file found at ${CREDENTIAL_INFO_FILE}`);
    console.log('No credentials to create. Exiting.');
    return;
  }

  // Wait for n8n to start
  const port = await waitForN8n();

  // Update the create-zalo-credential.js module with the correct port
  const createCredentialModule = require('./create-zalo-credential');
  createCredentialModule.setN8nPort(port);

  // Create credential
  try {
    console.log('Creating Zalo credential...');
    const result = await createCredentialModule.createCredential();
    console.log('Credential created successfully!');
    console.log(`ID: ${result.data.id}`);
    console.log(`Name: ${result.data.name}`);

    // Rename the credential info file to prevent creating it again
    const timestamp = new Date().getTime();
    const backupFile = path.join(process.cwd(), 'output', `zalo-credential-info-${timestamp}.json.bak`);
    fs.renameSync(CREDENTIAL_INFO_FILE, backupFile);
    console.log(`Credential info file renamed to ${backupFile}`);

    console.log('Done!');
  } catch (error) {
    console.error('Failed to create credential:', error.message);
    process.exit(1);
  }
}

// Run the main function
main().catch(error => {
  console.error('Error:', error.message);
  process.exit(1);
});
