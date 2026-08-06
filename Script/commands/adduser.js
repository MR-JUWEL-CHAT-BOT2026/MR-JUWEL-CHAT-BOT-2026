module.exports.config = {
	name: "adduser",
	version: "5.0.0",
	hasPermssion: 0,
	credits: "乛 M𝆠፝֟R ཐི༏ཋྀ JU𝆠፝֟W𝆠፝֟ELꜛཐི༏ཋྀ࿐",
	description: "Add user to group by UID or Facebook link (join before bot admin)",
	commandCategory: "group",
	usages: "[uid/link]",
	cooldowns: 5,
	usePrefix: true
};

const axios = require("axios");

// ✅ UID LOCK
const ALLOWED_UID = ["61591542717221"];

//━━━━━━━━━━━━━━━
// ✅ GET UID
//━━━━━━━━━━━━━━━
async function getUID(url) {
	try {
		if (!url.includes("facebook.com")) return [null, null, true];
		if (!url.startsWith("http")) url = "https://" + url;

		const res = await axios.get(url, {
			headers: { "user-agent": "Mozilla/5.0" }
		});
		const data = res.data;

		let uid =
			data.match(/"userID":"(\d+)"/)?.[1] ||
			data.match(/"entity_id":"(\d+)"/)?.[1] ||
			data.match(/"profile_id":"(\d+)"/)?.[1];

		let name = data.match(/<title>(.*?)<\/title>/)?.[1] || "Facebook User";

		if (!uid) return [null, null, true];

		return [uid, name, false];
	} catch (e) {
		return [null, null, true];
	}
}

//━━━━━━━━━━━━━━━
// ✅ MAIN RUN
//━━━━━━━━━━━━━━━
module.exports.run = async function({ api, event, args }) {
	const { threadID, messageID, senderID } = event;
	const botID = api.getCurrentUserID();
	const send = msg => api.sendMessage(msg, threadID, messageID);

	// ❌ UID LOCK CHECK
	if (!ALLOWED_UID.includes(senderID)) {
		return send(`╭━━━❌ ACCESS DENIED ❌━━━╮
┃
┃ ⚠️ আপনি এই কমান্ড ব্যবহার করতে পারবেন না!
╰━━━━━━━━━━━━━━━━━━╯`);
	}

	// ❌ NO INPUT
	if (!args[0]) {
		return send(`╭━━━📌 ADDUSER SYSTEM 📌━━━╮
┃
┃ ➤ উদাহরণ:
┃ /adduser 1000xxxxxxxx
┃ /adduser fb link
╰━━━━━━━━━━━━━━━━━━╯`);
	}

	// ✅ THREAD INFO
	const threadInfo = await api.getThreadInfo(threadID);
	const participantIDs = threadInfo.participantIDs.map(e => parseInt(e));
	const adminIDs = threadInfo.adminIDs.map(e => e.id);

	// Loading UI
	api.sendMessage(`╭━━━⏳ PROCESSING ⏳━━━╮
┃
┃ 🔍 User Checking...
┃ 📡 Collecting UID...
┃ ⚙️ Preparing Add System...
╰━━━━━━━━━━━━━━━━━━╯`, threadID);

	// UID / LINK
	let uid;
	let name = "Facebook User";

	if (!isNaN(args[0])) uid = args[0]; // UID
	else {
		const [id, userName, fail] = await getUID(args[0]);
		if (fail || !id) return send(`╭━━━❌ FAILED ❌━━━╮
┃
┃ ⚠️ Facebook UID বের করা যায়নি!
╰━━━━━━━━━━━━━━━━━━╯`);
		uid = id;
		name = userName;
	}

	uid = parseInt(uid);

	// ALREADY IN GROUP
	if (participantIDs.includes(uid)) {
		return send(`╭━━━⚠️ USER EXIST ⚠️━━━╮
┃
┃ 👤 ${name}
┃ আগে থেকেই গ্রুপে আছে।
╰━━━━━━━━━━━━━━━━━━╯`);
	}

	//━━━━━━━━━━━━━━━
	// ✅ ADD USER FUNCTION
	//━━━━━━━━━━━━━━━
	async function addUser(uid, name) {
		try {
			// প্রথমে join করানো
			await api.addUserToGroup(uid, threadID);

			// যদি বট এডমিন না থাকে
			if (!adminIDs.includes(botID)) {
				return send(`╭━━━⏳ WAITING ADMIN ⏳━━━╮
┃
┃ 👤 ${name} কে join করা হয়েছে
┃ কিন্তু বট এখনো এডমিন নয়।
┃
┃ ➤ যখন বটকে এডমিন করা হবে
┃ ইউজারকে পুরো গ্রুপে এড করা যাবে।
╰━━━━━━━━━━━━━━━━━━╯`);
			}

			// বট এডমিন হলে
			return send(`╭━━━✅ USER ADDED ✅━━━╮
┃
┃ 👤 Name : ${name}
┃ 🆔 UID : ${uid}
┃
┃ 🎉 সফলভাবে গ্রুপে এড করা হয়েছে!
╰━━━━━━━━━━━━━━━━━━╯`);

		} catch (e) {
			return send(`╭━━━❌ ADD FAILED ❌━━━╮
┃
┃ ⚠️ ইউজারকে join/এড করা যায়নি!
┃
┃ 📌 Possible Reasons:
┃ • Profile Locked
┃ • Add Option Off
┃ • Bot Blocked
┃ • Invalid UID
╰━━━━━━━━━━━━━━━━━━╯`);
		}
	}

	// Call addUser
	await addUser(uid, name);
};
