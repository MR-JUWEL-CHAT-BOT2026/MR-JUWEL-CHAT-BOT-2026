module.exports.config = {
	name: "setriya",
	version: "1.0.0",
	hasPermssion: 0,
	credits: "MR JUWEL",
	description: "Set bot nickname",
	commandCategory: "Box Chat",
	usages: "",
	cooldowns: 3
};

module.exports.run = async function({ api, event }) {
	try {
		const nick = "⎯꯭𓆩꯭𝆺𝅥😻⃞𝐑⃞𝐈⃞𝐘⃞𝐀⃞༢࿐";
		const botID = api.getCurrentUserID();

		await api.changeNickname(nick, event.threadID, botID);

		return api.sendMessage("✅ Bot nickname updated successfully!", event.threadID);
	} catch (err) {
		console.log(err);
		return api.sendMessage("❌ Nickname change failed!", event.threadID);
	}
};
