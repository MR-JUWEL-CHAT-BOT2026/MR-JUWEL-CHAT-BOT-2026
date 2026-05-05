module.exports.config = {
	name: "penis",
	version: "1.0.0",
	hasPermssion: 0,
	credits: "𝐂𝐘𝐁𝐄𝐑 ☢️_𖣘 -𝐁𝐎𝐓 ⚠️ 𝑻𝑬𝑨𝑴_ ☢️",
	description: "( ͡° ͜ʖ ͡°)",
	commandCategory: "random-text",
	cooldowns: 1
};

module.exports.run = ({ event, api }) => api.sendMessage(`8${'='.repeat(Math.floor(Math.random() * 10))}D`, event.threadID, event.messageID);