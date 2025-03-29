const ZaloFindUserInformationByPhoneNumber = require('./nodes/ZaloFindUserInformationByPhoneNumber/ZaloFindUserInformationByPhoneNumbernode.json');
const ZaloSendMessage = require('./nodes/ZaloSendMessage/ZaloSendMessage.node.json');
const ZaloAcceptFriendRequest = require('./nodes/ZaloAcceptFriendRequest/ZaloAcceptFriendRequest.node.json');
const ZaloAddGroupDeputy = require('./nodes/ZaloAddGroupDeputy/ZaloAddGroupDeputy.node.json');

module.exports = [
	ZaloFindUserInformationByPhoneNumber,
	ZaloSendMessage,
	ZaloAcceptFriendRequest,
	ZaloAddGroupDeputy,
];
