import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeConnectionType,
	NodeOperationError,
} from 'n8n-workflow';
import { API, ThreadType, Zalo } from 'zca-js';
let api: API | undefined;

export class ZaloSendMessage implements INodeType {

	description: INodeTypeDescription = {
		displayName: 'Zalo Send Message (Cookie)',
		name: 'zaloSendMessageCookie',
		icon: 'file:zalo.png',
		group: ['Zalo'],
		version: 1,
		description: 'Gửi tin nhắn qua API Zalo sử dụng kết nối đăng nhập bằng cookie',
		defaults: {
			name: 'Zalo Send Message (Cookie)',
		},
		inputs: [NodeConnectionType.Main],
		outputs: [NodeConnectionType.Main],
		// Add credentials for Zalo API authentication
		credentials: [
			{
				name: 'zaloApi',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Thread ID',
				name: 'threadId',
				type: 'string',
				default: '',
				required: true,
				description: 'ID của thread để gửi tin nhắn',
			},
			{
				displayName: 'Type',
				name: 'type',
				type: 'number',
				default: 0,
				description: 'Loại của tin nhắn (user hoặc group)',
			},
			{
				displayName: 'Message',
				name: 'message',
				type: 'string',
				default: '',
				required: true,
				description: 'Nội dung tin nhắn cần gửi',
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
        // We need to parse the cookie string into an object that zca-js can use
        const _api = await zalo.login({
            cookie: cookieStr,
            imei,
            userAgent,
        } as any); // Use 'as any' to bypass type checking
        api = _api;
        if (!api) {
            throw new NodeOperationError(this.getNode(), 'No API instance found. Please make sure to provide valid credentials.')
        }
        this.logger.info(`API ${JSON.stringify(api)}`);
        console.log('API', api);

        const threadId = this.getNodeParameter('threadId', 0) as string;
        const type = ThreadType.User;//this.getNodeParameter('type', 0) as any;
        const message = this.getNodeParameter('message', 0) as string;
        const meta = {threadId, type, message};
        // Gửi tin nhắn một lần
        try {
            this.logger.info(`Parameters before sending message: ${JSON.stringify(meta)}`);


            const response = await api.sendMessage({
                msg: message,

            },

            threadId,
            type);

            this.logger.info('Message sent successfully', {message, threadId, type});
            returnData.push({
                json: response,
            });
        } catch (error) {
            this.logger.error('Error in sendMessage:', { error });
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
