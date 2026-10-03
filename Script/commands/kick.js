module.exports.config = {
	name: "kick",
	version: "1.5.0",
	hasPermssion: 1,
	credits: "MR JUWEL",
	description: "Ultra fast multi kick system",
	commandCategory: "System",
	usages: "[tag/reply]",
	cooldowns: 2,
};

module.exports.run = async function ({ api, event }) {
	try {
		let targetIDs = [];

		if (event.type === "message_reply") {
			targetIDs.push(event.messageReply.senderID);
		}

		if (event.mentions) {
			targetIDs = targetIDs.concat(Object.keys(event.mentions));
		}

		targetIDs = [...new Set(targetIDs)];

		if (targetIDs.length === 0)
			return api.sendMessage("⚠️ Reply or tag someone!", event.threadID, event.messageID);

		const total = targetIDs.length;

		// instant UI
		const msg = await api.sendMessage(
			`⚡ KICK STARTED\n👥 Total: ${total}\n🚀 Fast mode ON`,
			event.threadID
		);

		let kicked = 0;
		let failed = 0;

		// ⚡ FAST PARALLEL KICK (no delay)
		await Promise.all(
			targetIDs.map(async (id) => {
				try {
					await api.removeUserFromGroup(id, event.threadID);
					kicked++;
				} catch (e) {
					failed++;
				}
			})
		);

		// final result
		return api.sendMessage(
			`╭──── FAST RESULT ────╮\n` +
			`│ 👥 Total: ${total}\n` +
			`│ ✅ Kicked: ${kicked}\n` +
			`│ ❌ Failed: ${failed}\n` +
			`│ ⚡ Mode: Ultra Fast\n` +
			`╰────────────────────╯`,
			event.threadID
		);

	} catch (err) {
		console.log(err);
		return api.sendMessage("❌ Kick error!", event.threadID);
	}
};
