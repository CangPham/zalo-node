import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeConnectionType,
	NodeOperationError,
} from 'n8n-workflow';
import { Zalo } from 'zca-js';
export class ZaloAddReaction implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Zalo Add Reaction',
		name: 'zaloAddReaction',
		icon: 'file:zalo.png',
		group: ['Zalo'],
		version: 1,
		description: 'Adds a reaction to a Zalo message',
		defaults: {
			name: 'Zalo Add Reaction',
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
				displayName: 'Message content',
				name: 'content',
				type: 'string',
				default: '',
				required: true,
				description: 'The content of the message to add the reaction to',
			},
			{
				displayName: 'Reaction',
				name: 'reaction',
				type: 'options',
				options: [
					{
						name: 'Heart',
						value: 'HEART',
					},
					{
						name: 'Like',
						value: 'LIKE',
					},
					{
						name: 'Haha',
						value: 'HAHA',
					},
					{
						name: 'Wow',
						value: 'WOW',
					},
					{
						name: 'Cry',
						value: 'CRY',
					},
					{
						name: 'Angry',
						value: 'ANGRY',
					},
					{
						name: 'None',
						value: 'NONE',
					},
				],
				default: 'LIKE',
				required: true,
				description: 'The reaction to add',
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
		const api = _api;

		if (!api) {
			throw new NodeOperationError(
				this.getNode(),
				'No API instance found. Please make sure to provide valid credentials.',
			);
		}

		const content = this.getNodeParameter('content', 0) as string;
		const reaction = this.getNodeParameter('reaction', 0)?.valueOf() as string;
		enum Reactions {
			HEART = '/-heart',
			LIKE = '/-strong',
			HAHA = ':>',
			WOW = ':o',
			CRY = ':-((',
			ANGRY = ':-h',
			KISS = ':-*',
			TEARS_OF_JOY = ":')",
			SHIT = '/-shit',
			ROSE = '/-rose',
			BROKEN_HEART = '/-break',
			DISLIKE = '/-weak',
			LOVE = ';xx',
			CONFUSED = ';-/',
			WINK = ';-)',
			FADE = '/-fade',
			SUN = '/-li',
			BIRTHDAY = '/-bd',
			BOMB = '/-bome',
			OK = '/-ok',
			PEACE = '/-v',
			THANKS = '/-thanks',
			PUNCH = '/-punch',
			SHARE = '/-share',
			PRAY = '_()_',
			NO = '/-no',
			BAD = '/-bad',
			LOVE_YOU = '/-loveu',
			SAD = '--b',
			VERY_SAD = ':((',
			COOL = 'x-)',
			NERD = '8-)',
			BIG_SMILE = ';-d',
			SUNGLASSES = 'b-)',
			NEUTRAL = ':--|',
			SAD_FACE = 'p-(',
			BYE = ':-bye',
			SLEEPY = '|-)',
			WIPE = ':wipe',
			DIG = ':-dig',
			ANGUISH = '&-(',
			HANDCLAP = ':handclap',
			ANGRY_FACE = '>-|',
			F_CHAIR = ':-f',
			L_CHAIR = ':-l',
			R_CHAIR = ':-r',
			SILENT = ';-x',
			SURPRISE = ':-o',
			EMBARRASSED = ';-s',
			AFRAID = ';-a',
			SAD2 = ':-<',
			BIG_LAUGH = ':))',
			RICH = '$-)',
			BEER = '/-beer',
			NONE = '',
		}

		try {
			if (!reaction || !(reaction in Reactions)) {
				throw new Error(`Invalid reaction: ${reaction}`);
			}

			// Call the API to add the reaction
			//const reactionValue = Reactions[reaction as keyof typeof Reactions];

			// 4. Call the API with the Enum Value
			//const response = await api.addReaction(reactionValue, content);
			// console.log(response);

			returnData.push({
				json: {
					message: 'Reaction added successfully!',
					messageId: content,
					reaction: reaction,
				},
			});
		} catch (error) {
			throw new NodeOperationError(this.getNode(), error as Error, { itemIndex: 0 });
		}

		return [returnData];
	}
}
