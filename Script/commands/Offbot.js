module.exports.config = {
	name: "offbot",
	version: "2.0.0",
	hasPermssion: 2,
	credits: "乛 M𝆠፝֟R ཐི༏ཋྀ JU𝆠፝֟W𝆠፝֟ELꜛཐི༏ཋྀ࿐",
	description: "Turn the bot off",
	commandCategory: "system",
	cooldowns: 0
};

const startTime = global.botStartTime || (global.botStartTime = Date.now());

module.exports.run = async ({ event, api }) => {

	const permission = [
		"61591542717221",
		"61567576882007"
	];

	if (!permission.includes(event.senderID)) {
		return api.sendMessage(
			"❌ | You don't have permission to use this command.",
			event.threadID,
			event.messageID
		);
	}

	const uptime = Date.now() - startTime;

	const days = Math.floor(uptime / (1000 * 60 * 60 * 24));
	const hours = Math.floor((uptime / (1000 * 60 * 60)) % 24);
	const minutes = Math.floor((uptime / (1000 * 60)) % 60);
	const seconds = Math.floor((uptime / 1000) % 60);

	const msg = `
╔═══════════════════╗
        ⚠️ 𝑩𝑶𝑻 𝑺𝑯𝑼𝑻𝑫𝑶𝑾𝑵 ⚠️
╚═══════════════════╝

🤖 𝑩𝒐𝒕 𝑵𝒂𝒎𝒆 : ${global.config.BOTNAME}

📊 𝑩𝒐𝒕 𝑼𝒑𝒕𝒊𝒎𝒆
━━━━━━━━━━━━━━━━━━
📅 ${days} 𝑫𝒂𝒚(𝒔)
🕐 ${hours} 𝑯𝒐𝒖𝒓(𝒔)
🕑 ${minutes} 𝑴𝒊𝒏𝒖𝒕𝒆(𝒔)
🕒 ${seconds} 𝑺𝒆𝒄𝒐𝒏𝒅(𝒔)

━━━━━━━━━━━━━━━━━━
🔴 𝑻𝒉𝒆 𝑩𝒐𝒕 𝒊𝒔 𝒏𝒐𝒘 𝑺𝒉𝒖𝒕𝒕𝒊𝒏𝒈 𝑫𝒐𝒘𝒏...
💤 𝑺𝒆𝒆 𝒚𝒐𝒖 𝒂𝒈𝒂𝒊𝒏!

🤖𝐁🅞𝐓⚠️𝐎𝐅𝐅❌☢️

╔════════════════╗
      ❤️ 𝑻𝒉𝒂𝒏𝒌 𝒀𝒐𝒖 ❤️
╚════════════════╝
`;

	api.sendMessage(msg, event.threadID, () => {
		setTimeout(() => process.exit(0), 3000);
	}, event.messageID);
};
