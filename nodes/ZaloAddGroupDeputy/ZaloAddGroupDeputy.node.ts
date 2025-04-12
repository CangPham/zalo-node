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

export class ZaloAddGroupDeputy implements INodeType {

	description: INodeTypeDescription = {
		displayName: 'Zalo Add Group Deputy',
		name: 'zaloAddGroupDeputy',
		icon: 'file:zalo.png',
		group: ['Zalo'],
		version: 1,
		description: 'Thêm phó nhóm vào nhóm Zalo',
		defaults: {
			name: 'Zalo Add Group Deputy',
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
				displayName: 'Group ID',
				name: 'groupId',
				type: 'string',
				default: '',
				required: true,
				description: 'ID của nhóm Zalo',
			},
			{
				displayName: 'User ID',
				name: 'userId',
				type: 'string',
				default: '',
				required: true,
				description: 'ID của người dùng cần thêm làm phó nhóm',
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

      	const groupId = this.getNodeParameter('groupId', 0) as string;
      	const userId = this.getNodeParameter('userId', 0) as string;
        // Gửi tin nhắn một lần
        try {
            this.logger.info(`Parameters before sending message: ${JSON.stringify({groupId, userId})}`);


            const response = await api.addGroupDeputy(groupId, userId);
            this.logger.info(`Find successfully: ${JSON.stringify({groupId, userId})}`);

            returnData.push({
                json: JSON.parse(response),
            });
        } catch (error) {
            this.logger.error('Error in addGroupDeputy:', { error });
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
