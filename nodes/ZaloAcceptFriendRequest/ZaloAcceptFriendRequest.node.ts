import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeConnectionType,
	NodeOperationError,
} from 'n8n-workflow';
import { API, Zalo } from 'zca-js';
let api: API | undefined;

export class ZaloAcceptFriendRequest implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Zalo Accept Friend Request',
		name: 'zaloAcceptFriendRequestCookie',
		icon: 'file:zalo.png',
		group: ['Zalo'],
		version: 1,
		description: 'Chấp nhận lời mời kết bạn qua API Zalo sử dụng kết nối đăng nhập bằng cookie',
		defaults: {
			name: 'Zalo Accept Friend Request',
		},
		inputs: [NodeConnectionType.Main],
		outputs: [NodeConnectionType.Main],
		credentials: [
			{
				name: 'zaloApi',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'User ID',
				name: 'userId',
				type: 'string',
				default: '',
				required: true,
				description: 'ID của người dùng cần chấp nhận lời mời kết bạn',
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const returnData: INodeExecutionData[] = [];

		// Get credentials
		const credentials = await this.getCredentials('zaloApi');

		// Parse the cookie string into the format expected by zca-js
		const cookieStr = credentials.cookie as string;
		const imei = credentials.imei as string;
		const userAgent = credentials.userAgent as string;

		this.logger.info('Using Zalo API credentials');

		const zalo = new Zalo();
		// Login with credentials
		const _api = await zalo.login({
			cookie: cookieStr,
			imei,
			userAgent,
		} as any); // Use 'as any' to bypass type checking
		api = _api;
		if (!api) {
			throw new NodeOperationError(
				this.getNode(),
				'No API instance found. Please make sure to provide valid credentials.',
			);
		}

		const userId = this.getNodeParameter('userId', 0) as string;
		const meta = { userId };
		try {
			this.logger.info(`Parameters before accepting friend request: ${JSON.stringify(meta)}`);

			const response = await api.acceptFriendRequest(userId);

			this.logger.info('Friend request accepted successfully', { response });
			returnData.push({
				json: {},
			});
		} catch (error) {
			this.logger.error('Error in acceptFriendRequest:', { error });
			if ((error as any).response) {
				this.logger.error('Error response:', { response: (error as any).response });
			}
			if ((error as any).stack) {
				this.logger.error('Error stack:', { stack: (error as any).stack });
			}
			throw new NodeOperationError(this.getNode(), error as Error, { itemIndex: 0 });
		}

		return [returnData];
	}
}
