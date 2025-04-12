# Zalo Credentials Setup Guide

This guide explains how to set up Zalo credentials for use with the Zalo nodes in n8n.

## Step 1: Generate Credentials with ZaloLoginViaQRCode Node

1. Open n8n in your browser at http://localhost:5678
2. Create a new workflow
3. Add the **ZaloLoginViaQRCode** node
4. Configure the node:
   - **Create Zalo Credentials**: Set to `true`
   - **Credential Name**: Enter a name for your credentials (e.g., "Zalo API Credentials")
   - **Proxy**: Leave empty or enter a proxy if needed
   - **Timeout**: Default is 30 seconds
   - **Output File Name**: Default is "zalo-qr-code.png"
5. Run the node
6. Scan the QR code with your Zalo app
7. Wait for the login process to complete

After scanning the QR code, the node will save the credentials to:
- `output/zalo-credentials.json`
- `data/cookies/cred_[timestamp].json`

## Step 2: Create Credentials in n8n

### Option 1: Using the Helper Script (Recommended)

1. Install axios if you don't have it:
   ```
   npm install axios
   ```

2. Run the helper script:
   ```
   node create-zalo-credential.js
   ```

3. The script will:
   - Read the credentials from `output/zalo-credentials.json`
   - Create a credential in n8n with the name you specified
   - Display the credential ID and other information

### Option 2: Manual Creation

1. Go to n8n Settings > Credentials
2. Click "Add Credential"
3. Select "Zalo API" as the credential type
4. Enter a name for the credential
5. Copy the values from `output/zalo-credentials.json`:
   - **Cookie**: Copy the cookie value
   - **IMEI**: Copy the imei value
   - **User Agent**: Copy the userAgent value
6. Click "Save"

## Step 3: Use the Credentials in Zalo Nodes

1. Add a Zalo node to your workflow (e.g., "Zalo Send Message (Cookie)")
2. In the node settings, select the credential you created from the "Credential to connect with" dropdown
3. Configure the other node parameters as needed
4. Run the node

## Troubleshooting

If you encounter issues:

1. **QR Code Login Fails**:
   - Make sure your Zalo app is up to date
   - Try running the ZaloLoginViaQRCode node again

2. **Credential Creation Fails**:
   - Make sure n8n is running
   - Check if the credential type "zaloApi" exists in n8n
   - Try creating the credential manually

3. **Zalo Nodes Can't Use the Credential**:
   - Make sure the credential was created successfully
   - Check if the credential is of type "zaloApi"
   - Try selecting the credential from the dropdown in the node settings

4. **Credential Expires**:
   - Zalo credentials may expire after some time
   - If a node stops working, generate new credentials using the ZaloLoginViaQRCode node

## Files

- `output/zalo-credentials.json`: Contains the credentials in JSON format
- `output/zalo-debug.txt` and `output/zalo-debug-login.txt`: Debug information
- `data/cookies/cred_[timestamp].json`: Backup of credentials with timestamp
- `create-zalo-credential.js`: Helper script to create credentials in n8n
