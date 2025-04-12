import {
	INodeType,
	INodeTypeDescription,
	IWebhookFunctions,
	IWebhookResponseData,
	NodeConnectionType,
	IDataObject,
	INodeExecutionData,
} from 'n8n-workflow';
import { Zalo } from 'zca-js';

export class ZaloWebhook implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Zalo QR Login',
		name: 'zaloWebhook',
		group: ['trigger'],
		version: 1,
		description: 'Trigger a workflow with Zalo QR login',
		defaults: {
			name: 'Zalo QR Login',
		},
		inputs: [],
		outputs: [{ type: NodeConnectionType.Main }],
		credentials: [
			{
				name: 'zaloApi',
				required: false,
			},
		],
		webhooks: [
			{
				name: 'default',
				httpMethod: 'GET',
				responseMode: 'lastNode',
				path: 'qrcode',
			},
		],
		properties: [
			{
				displayName: 'Response Type',
				name: 'responseType',
				type: 'options',
				options: [
					{
						name: 'HTML',
						value: 'html',
						description: 'Return HTML with QR code',
					},
					{
						name: 'JSON',
						value: 'json',
						description: 'Return JSON with QR code data URL',
					},
				],
				default: 'html',
				description: 'The type of response to return',
			},
		],
	};

	async webhook(this: IWebhookFunctions): Promise<IWebhookResponseData> {
		const responseType = this.getNodeParameter('responseType') as string;

		try {
			// Initialize Zalo library
			const zalo = new Zalo();

			// Try to get credentials if provided
			let credentials;
			try {
				credentials = await this.getCredentials('zaloApi');
			} catch (error) {
				// No credentials provided, which is fine
			}

			// If credentials are provided, use them
			if (credentials) {
				const cookieStr = credentials.cookie as string;
				const imei = credentials.imei as string;
				const userAgent = credentials.userAgent as string;

				// Login with credentials
				await zalo.login({
					cookie: cookieStr,
					imei,
					userAgent,
				} as any);
			}

			// Generate QR code
			const qrCodeDataUrl = await generateQRCode(zalo);

			// Create data object
			const data: IDataObject = {
				success: true,
				qrCodeDataUrl,
				message: 'Scan this QR code with your Zalo app to login',
			};

			// Create execution data
			const executionData: INodeExecutionData = {
				json: data,
			};

			if (responseType === 'json') {
				// Return JSON response
				return {
					workflowData: [[executionData]],
				};
			} else {
				// Generate HTML with QR code
				const htmlContent = generateQRCodeHTML(qrCodeDataUrl);

				// Create a direct HTML response
				const response: IWebhookResponseData = {
					workflowData: [[executionData]],
				};

				// Add HTML content directly to the response
				(response as any).noWebhookResponse = false;
				(response as any).rawBody = htmlContent;
				(response as any).contentType = 'text/html';

				return response;
			}
		} catch (error) {
			// Handle errors
			// Create error data object
			const errorData: IDataObject = {
				success: false,
				error: error.message || 'Failed to generate QR code',
			};

			// Create execution data
			const errorExecutionData: INodeExecutionData = {
				json: errorData,
			};

			if (responseType === 'json') {
				return {
					workflowData: [[errorExecutionData]],
				};
			} else {
				// Generate error HTML
				const errorHtml = `
<!DOCTYPE html>
<html>
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>Error - Zalo QR Code Login</title>
	<style>
		body {
			font-family: Arial, sans-serif;
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			height: 100vh;
			margin: 0;
			background-color: #f5f5f5;
		}
		.container {
			background-color: white;
			border-radius: 8px;
			box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
			padding: 30px;
			text-align: center;
			max-width: 400px;
			width: 100%;
		}
		h1 {
			color: #f44336;
			margin-bottom: 20px;
		}
		.error-message {
			margin: 20px 0;
			color: #666;
		}
		.refresh-button {
			background-color: #2196F3;
			color: white;
			border: none;
			padding: 10px 20px;
			border-radius: 4px;
			cursor: pointer;
			margin-top: 20px;
			font-size: 14px;
		}
		.refresh-button:hover {
			background-color: #0b7dda;
		}
	</style>
</head>
<body>
	<div class="container">
		<h1>Error</h1>
		<div class="error-message">
			<p>${error.message || 'Failed to generate QR code'}</p>
		</div>
		<button class="refresh-button" onclick="window.location.reload()">Try Again</button>
	</div>
</body>
</html>
				`;

				// Create a direct HTML response for error
				const response: IWebhookResponseData = {
					workflowData: [[errorExecutionData]],
				};

				// Add HTML content directly to the response
				(response as any).noWebhookResponse = false;
				(response as any).rawBody = errorHtml;
				(response as any).contentType = 'text/html';

				return response;
			}
		}
	}
}

// Helper function to generate QR code HTML
function generateQRCodeHTML(qrCodeDataUrl: string): string {
	return `
<!DOCTYPE html>
<html>
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>Zalo QR Code Login</title>
	<style>
		body {
			font-family: Arial, sans-serif;
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			height: 100vh;
			margin: 0;
			background-color: #f5f5f5;
		}
		.container {
			background-color: white;
			border-radius: 8px;
			box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
			padding: 30px;
			text-align: center;
			max-width: 400px;
			width: 100%;
		}
		h1 {
			color: #2196F3;
			margin-bottom: 20px;
		}
		.qr-code {
			margin: 20px 0;
		}
		.qr-code img {
			max-width: 200px;
			height: auto;
		}
		.instructions {
			text-align: left;
			margin-top: 20px;
		}
		.instructions ol {
			padding-left: 20px;
		}
		.instructions li {
			margin-bottom: 10px;
		}
		.refresh-button {
			background-color: #2196F3;
			color: white;
			border: none;
			padding: 10px 20px;
			border-radius: 4px;
			cursor: pointer;
			margin-top: 20px;
			font-size: 14px;
		}
		.refresh-button:hover {
			background-color: #0b7dda;
		}
		.status {
			margin-top: 15px;
			font-style: italic;
			color: #666;
		}
	</style>
</head>
<body>
	<div class="container">
		<h1>Zalo QR Code Login</h1>
		<div class="qr-code">
			<img src="${qrCodeDataUrl}" alt="Zalo QR Code">
		</div>
		<div class="status">Scan this QR code with your Zalo app</div>
		<div class="instructions">
			<h3>Instructions:</h3>
			<ol>
				<li>Open your Zalo app on your phone</li>
				<li>Scan this QR code</li>
				<li>Confirm the login on your phone</li>
				<li>After successful login, use the cookie, IMEI, and userAgent values from your Zalo app to create a Zalo API credential</li>
			</ol>
		</div>
		<button class="refresh-button" onclick="window.location.reload()">Refresh QR Code</button>
	</div>
</body>
</html>
	`;
}

// Helper function to generate QR code
async function generateQRCode(zalo: Zalo): Promise<string> {
	return new Promise<string>((resolve, reject) => {
		let qrCodeDataUrl = '';
		let isResolved = false;

		// Set a timeout to prevent hanging
		const timeout = setTimeout(() => {
			if (!isResolved) {
				isResolved = true;
				reject(new Error('Timeout generating QR code'));
			}
		}, 10000); // 10 seconds timeout

		try {
			// @ts-ignore
			zalo.loginQR({
				// @ts-ignore
				onQR: (event: any) => {
					console.log('Received QR event type:', event.type);

					if (event.type === 0 && event.data && event.data.image) {
						// QR code generated
						qrCodeDataUrl = `data:image/png;base64,${event.data.image}`;

						// Clear timeout
						clearTimeout(timeout);

						if (!isResolved) {
							isResolved = true;
							resolve(qrCodeDataUrl);
						}
					} else if (event.type === 3) {
						// QR code expired
						console.log('QR code expired. Please try again.');

						// Clear timeout
						clearTimeout(timeout);

						if (!isResolved) {
							isResolved = true;
							reject(new Error('QR code expired. Please try again.'));
						}
					}
				},
				onError: (error: any) => {
					console.error('Error in QR login:', error);

					// Clear timeout
					clearTimeout(timeout);

					if (!isResolved) {
						isResolved = true;
						reject(new Error(error.message || 'Failed to generate QR code'));
					}
				},
			});
		} catch (error) {
			// Clear timeout
			clearTimeout(timeout);

			if (!isResolved) {
				isResolved = true;
				reject(error);
			}
		}
	});
}


