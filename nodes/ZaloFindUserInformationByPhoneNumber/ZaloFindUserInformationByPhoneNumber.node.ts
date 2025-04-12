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

export class ZaloFindUserInformationByPhoneNumber implements INodeType {

	description: INodeTypeDescription = {
		displayName: 'Zalo Find User Information By PhoneNumber',
		name: 'zaloFindUserInformationByPhoneNumber',
		icon: 'file:zalo.png',
		group: ['Zalo'],
		version: 1,
		description: 'Tìm người dùng bằng số điện thoại',
		defaults: {
			name: 'Zalo Find User',
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
				displayName: 'Phone Number',
				name: 'phoneNumber',
				type: 'string',
				default: '',
				required: true,
				description: 'Số điện thoại của người dùng cần tìm',
			}

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
            throw new NodeOperationError(this.getNode(), 'No API instance found. Please make sure to provide valid credentials.')
        }

      	const phoneNumber = this.getNodeParameter('phoneNumber', 0) as string;
        // Gửi tin nhắn một lần
        try {
            this.logger.info(`Parameters before sending message: ${JSON.stringify(phoneNumber)}`);


            const response = await api.findUser(phoneNumber);
            this.logger.info(`Find successfully: ${JSON.stringify(phoneNumber)}`);

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
