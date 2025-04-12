import { API, Zalo } from 'zca-js';
import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeConnectionType,
	NodeOperationError,
} from 'n8n-workflow';
let api: API | undefined;

export class ZaloGetGroupInfo implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Zalo Get Group Info',
		name: 'zaloGetGroupInfo',
		icon: 'file:nodes/ZaloGetGroupInfo/zalo.png',
		group: ['zalo'],
		version: 1,
		description: 'Get group information from Zalo',
		defaults: {
			name: 'Zalo Get Group Info',
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
				description: 'The ID of the group to retrieve information for',
				required: true,
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

		const groupId = this.getNodeParameter('groupId', 0) as string;
		try {
			this.logger.info(`Parameters before getting group: ${JSON.stringify(groupId)}`);

			const response = await api.getGroupInfo(groupId);
			this.logger.info(`Find successfully: ${JSON.stringify(groupId)}`);

			returnData.push({
				json: response,
			});
		} catch (error) {
			this.logger.error('Error in get Group:', { error });
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
