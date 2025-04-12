# Zalo Integration for n8n

This is a collection of nodes for n8n that allow you to integrate Zalo into your workflows.

## Features

- **ZaloLoginViaQRCode**: Login to Zalo via QR code and automatically create credentials
- **ZaloSendMessage**: Send messages to Zalo contacts
- **ZaloWebhook**: Receive messages from Zalo
- And more...

## Installation

1. Make sure you have n8n installed
2. Copy the files in this directory to your n8n directory
3. Install axios if you don't have it: `npm install axios`
4. Run `npm run build` to compile the nodes
5. Start n8n with `n8n start`

## Usage

See the [HUONG-DAN-SU-DUNG.md](HUONG-DAN-SU-DUNG.md) file for detailed usage instructions.

## Automatic Credential Creation

This package includes a script that automatically creates Zalo API credentials in n8n after a successful login. The process works as follows:

1. Run the ZaloLoginViaQRCode node with "Create Zalo Credentials" set to true
2. Scan the QR code with your Zalo app
3. After successful login, the node saves your credentials to files
4. Run the auto-create-zalo-credential.js script to create the credentials in n8n
5. The script automatically checks if n8n is running and creates the credentials

## Files

- **nodes/**: Contains all the Zalo nodes
- **credentials/**: Contains the Zalo API credential type
- **create-zalo-credential.js**: Script to create credentials in n8n
- **auto-create-zalo-credential.js**: Script to automatically create credentials when n8n starts
- **HUONG-DAN-SU-DUNG.md**: Detailed usage instructions in Vietnamese

## License

MIT
