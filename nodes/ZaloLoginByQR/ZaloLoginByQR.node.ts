import { LoginQRCallbackEvent, Zalo } from 'zca-js';
import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeConnectionType,
	NodeOperationError,
} from 'n8n-workflow';

// Interface for message payload (keep this for clarity)
interface IQrCodeUIMessage {
	type: 'displayZaloQR' | 'clearZaloQR' | 'loginStatusUpdate';
	qrCodeDataUrl?: string;
	message?: string;
	status?: 'waiting' | 'scanned' | 'confirmed' | 'expired' | 'error' | 'success';
}

export class ZaloLoginByQR implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Zalo Login By QR (HTML UI)', // Updated name
		name: 'zaloLoginByQR', // Unique name
		icon: 'file:zalo.png',
		group: ['zalo'],
		version: 1,
		description: 'Login to Zalo using QR code displayed in the node panel (HTML UI)',
		defaults: {
			name: 'Zalo Login By QR (HTML UI)',
		},
		inputs: [NodeConnectionType.Main],
		outputs: [NodeConnectionType.Main],
		properties: [],
		// @ts-ignore - Suppress the error for the next line
		ui: {
			// Assumes your HTML file is named ZaloLoginByQR.node.html
			// Adjust path based on your build output structure (e.g., inside dist)
			embeddable: 'nodes/ZaloLoginByQR/ZaloLoginByQR.node.html', // Point to HTML
			receives: ['displayZaloQR', 'clearZaloQR', 'loginStatusUpdate'],
		},
	};

	// --- execute function remains IDENTICAL to the Vue example ---
	// It sends messages using this.sendMessageToUI(...)
	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const returnData: INodeExecutionData[] = [];
		const zalo = new Zalo();

		// Helper to send messages (same as before)
		const sendMessage = (
			payload: Omit<IQrCodeUIMessage, 'type'>,
			type: IQrCodeUIMessage['type'],
		) => {
			const messagePayload: IQrCodeUIMessage = { ...payload, type };
			this.sendMessageToUI(messagePayload);
		};

		try {
			this.logger.info('Starting Zalo QR Login process...');
			sendMessage({ message: 'Initializing QR Login...', status: 'waiting' }, 'loginStatusUpdate');

			const api = await zalo.loginQR({}, (event: LoginQRCallbackEvent) => {
				// ... (Callback logic sending messages is EXACTLY the same) ...
				if (event.type === 0 && event.data?.image) {
					const qrCodeImage = `data:image/png;base64,${event.data.image}`;
					sendMessage(
						{
							qrCodeDataUrl: qrCodeImage,
							message: 'Scan QR Code with Zalo App',
							status: 'waiting',
						},
						'displayZaloQR',
					);
				} else if (event.type === 1) {
					sendMessage(
						{ message: 'QR Scanned. Waiting for phone confirmation...', status: 'scanned' },
						'loginStatusUpdate',
					);
					sendMessage({}, 'clearZaloQR');
				} else if (event.type === 2) {
					// Login confirmed - success message sent later
				} else if (event.type === 3) {
					sendMessage(
						{ message: 'QR Code Expired. Please re-run.', status: 'expired' },
						'loginStatusUpdate',
					);
					sendMessage({}, 'clearZaloQR');
					// throw new NodeOperationError(this.getNode(), 'QR Code Expired', { itemIndex: 0 });
				}
			});

			this.logger.info('Login successful via QR. Retrieving context...');
			sendMessage(
				{ message: 'Login Confirmed. Getting session...', status: 'confirmed' },
				'loginStatusUpdate',
			);
			const context = await api.getContext();
			const loginData = {
				imei: context.imei,
				cookie: context.cookie,
				userAgent: context.userAgent,
			};

			returnData.push({
				json: {
					status: 'success',
					message: 'Zalo login successful via QR code.',
					zaloContext: loginData,
				},
			});
			sendMessage({ message: 'Login Successful!', status: 'success' }, 'loginStatusUpdate');
			sendMessage({}, 'clearZaloQR');
		} catch (error) {
			this.logger.error('Error in QR Login:', error);
			sendMessage({ message: `Error: ${error.message}`, status: 'error' }, 'loginStatusUpdate');
			sendMessage({}, 'clearZaloQR');
			// ... (rest of error handling) ...
			throw new NodeOperationError(this.getNode(), error as Error, {
				itemIndex: 0,
				description: 'Failed to login to Zalo using QR code.',
			});
		}
		return this.prepareOutputData(returnData);
	}
}
