import {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class ZaloApi implements ICredentialType {
	name = 'zaloApi';
	displayName = 'Zalo API';
	documentationUrl = 'https://developers.zalo.me/docs';
	properties: INodeProperties[] = [
		{
			displayName: 'Cookie',
			name: 'cookie',
			type: 'string',
			default: '',
			typeOptions: {
				password: true,
			},
			description: 'Cookie from Zalo login session',
		},
		{
			displayName: 'IMEI',
			name: 'imei',
			type: 'string',
			default: '',
			description: 'IMEI identifier from Zalo login session',
		},
		{
			displayName: 'User Agent',
			name: 'userAgent',
			type: 'string',
			default: '',
			description: 'User Agent from Zalo login session',
		},
		{
			displayName: 'Proxy',
			name: 'proxy',
			type: 'string',
			default: '',
			placeholder: 'http(s)://user:pass@host:port',
			description: 'HTTP proxy to use for Zalo API requests',
		},
		{
			displayName: 'Support Code',
			name: 'supportCode',
			type: 'string',
			default: '',
			description: 'Support code for Zalo API',
		},
		{
			displayName: 'License Key',
			name: 'licenseKey',
			type: 'string',
			default: '',
			description: 'License key for Zalo API',
			typeOptions: {
				password: true,
			},
		},
	];

	// This allows the credential to be used by other parts of n8n
	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				Cookie: '={{$credentials.cookie}}',
				'User-Agent': '={{$credentials.userAgent}}',
				'X-Support-Code': '={{$credentials.supportCode}}',
				'X-License-Key': '={{$credentials.licenseKey}}',
			},
			qs: {
				proxy: '={{$credentials.proxy}}',
			},
		},
	};

	// The block below tells how this credential can be tested
	test: ICredentialTestRequest = {
		request: {
			baseURL: 'https://chat.zalo.me',
			url: '/api/main',
			headers: {
				Cookie: '={{$credentials.cookie}}',
				'User-Agent': '={{$credentials.userAgent}}',
				'X-Support-Code': '={{$credentials.supportCode}}',
				'X-License-Key': '={{$credentials.licenseKey}}',
			},
			// Proxy is handled in the node implementation
		},
	};
}
