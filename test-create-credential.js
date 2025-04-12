const fs = require('fs');
const path = require('path');

// Create sample credential data
const credentialData = {
    cookie: 'sample_cookie_value',
    imei: 'sample_imei_value',
    userAgent: 'sample_user_agent'
};

// Create output directory if it doesn't exist
const outputDir = path.join(process.cwd(), 'output');
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
}

// Save credential data to file
const credentialsPath = path.join(outputDir, 'zalo-credentials.json');
fs.writeFileSync(credentialsPath, JSON.stringify(credentialData, null, 2));
console.log('Credentials saved to:', credentialsPath);

// Create data/cookies directory structure
const dataDir = path.join(process.cwd(), 'data');
const cookiesDir = path.join(dataDir, 'cookies');

if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
    console.log('Created data directory');
}

if (!fs.existsSync(cookiesDir)) {
    fs.mkdirSync(cookiesDir, { recursive: true });
    console.log('Created cookies directory');
}

// Save credential data to cookies directory
const userId = '123456789';
const credFileName = `cred_${userId}.json`;
const credFilePath = path.join(cookiesDir, credFileName);
fs.writeFileSync(credFilePath, JSON.stringify(credentialData, null, 4));
console.log(`Saved credential to: ${credFilePath}`);

console.log('Test completed successfully!');
