/**
 * This script creates a Zalo API credential in n8n using the credentials saved in the zalo-credentials.json file.
 *
 * Usage:
 * 1. Make sure n8n is running
 * 2. Install axios if you don't have it: npm install axios
 * 3. Run this script with Node.js: node create-zalo-credential.js
 */

const fs = require('fs');
const path = require('path');
let axios;

// Try to require axios, install it if not available
try {
  axios = require('axios');
} catch (error) {
  console.error('Axios is required but not installed.');
  console.error('Please install it using: npm install axios');
  process.exit(1);
}

// Configuration
let N8N_PORT = 5678;
let N8N_URL = `http://localhost:${N8N_PORT}`;
const CREDENTIALS_FILE = path.join(process.cwd(), 'output', 'zalo-credentials.json');
const CREDENTIAL_INFO_FILE = path.join(process.cwd(), 'output', 'zalo-credential-info.json');

// Function to set the n8n port
function setN8nPort(port) {
  if (port && typeof port === 'number') {
    N8N_PORT = port;
    N8N_URL = `http://localhost:${N8N_PORT}`;
    console.log(`N8N URL set to: ${N8N_URL}`);
  }
}

async function createCredential() {
  try {
    console.log('=== Zalo Credential Creator ===');
    console.log('This script will create a Zalo API credential in n8n using the credentials saved in the zalo-credentials.json file.');
    console.log('\nChecking for credential info file...');

    // Read credential info from file
    if (!fs.existsSync(CREDENTIAL_INFO_FILE)) {
      console.error(`\nCredential info file not found: ${CREDENTIAL_INFO_FILE}`);
      console.log('Checking for credentials file...');

      // Try to use the credentials file directly
      if (!fs.existsSync(CREDENTIALS_FILE)) {
        console.error(`\nCredentials file not found: ${CREDENTIALS_FILE}`);
        console.error('Please run the ZaloLoginViaQRCode node first to generate credentials.');
        return;
      }

      console.log('Credentials file found, but no credential info file.');
      console.log('Will use default credential type and name.');

      const credentialsData = JSON.parse(fs.readFileSync(CREDENTIALS_FILE, 'utf8'));

      // Check if credentials are valid
      if (!credentialsData.cookie || !credentialsData.imei || !credentialsData.userAgent) {
        console.error('\nInvalid credentials in file. Missing required fields (cookie, imei, userAgent).');
        return;
      }

      console.log('Credentials are valid.');
      console.log('\nConnecting to n8n at', N8N_URL);

      // Create credential in n8n with default values
      const response = await axios.post(`${N8N_URL}/rest/credentials`, {
        name: 'Zalo API Credentials',
        type: 'zaloApi',
        data: credentialsData,
        nodesAccess: []
      });

      return response;
    }

    console.log('Credential info file found!');
    const credentialInfo = JSON.parse(fs.readFileSync(CREDENTIAL_INFO_FILE, 'utf8'));

    // Check if credential info is valid
    if (!credentialInfo.type || !credentialInfo.name || !credentialInfo.data) {
      console.error('\nInvalid credential info in file. Missing required fields (type, name, data).');
      return;
    }

    // Check if credential data is valid
    if (!credentialInfo.data.cookie || !credentialInfo.data.imei || !credentialInfo.data.userAgent) {
      console.error('\nInvalid credential data in file. Missing required fields (cookie, imei, userAgent).');
      return;
    }

    console.log('Credential info is valid.');
    console.log(`Using credential type: ${credentialInfo.type}`);
    console.log(`Using credential name: ${credentialInfo.name}`);
    console.log('\nConnecting to n8n at', N8N_URL);

    // Create credential in n8n
    const response = await axios.post(`${N8N_URL}/rest/credentials`, {
      name: credentialInfo.name,
      type: credentialInfo.type,
      data: credentialInfo.data,
      nodesAccess: []
    });

    console.log('\n✅ Credential created successfully!');
    console.log('ID:', response.data.id);
    console.log('Name:', response.data.name);
    console.log('Type:', response.data.type);
    console.log('Created at:', new Date(response.data.createdAt).toLocaleString());

    console.log('\n🎉 You can now use this credential in your Zalo nodes.');
    console.log('Go to n8n and select this credential in your Zalo nodes.');

    return response;
  } catch (error) {
    console.error('\n❌ Error creating credential:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    } else {
      console.error(error.message);
    }

    console.error('\nPossible solutions:');
    console.error('1. Make sure n8n is running at', N8N_URL);
    console.error('2. Check if the credential type "zaloApi" exists in n8n');
    console.error('3. Try creating the credential manually in the n8n UI:');
    console.error('   - Go to Settings > Credentials > Add Credential');
    console.error('   - Select "Zalo API" as the credential type');
    console.error('   - Copy the values from output/zalo-credentials.json');

    throw error;
  }
}

// If this script is run directly (not imported), create the credential
if (require.main === module) {
  createCredential().catch(error => {
    console.error('Failed to create credential:', error.message);
    process.exit(1);
  });
}

// Export the functions for use in other scripts
module.exports = { createCredential, setN8nPort };
