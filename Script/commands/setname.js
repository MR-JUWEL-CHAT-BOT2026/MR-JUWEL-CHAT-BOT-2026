const fs = require("fs");

const nicknameDataPath = __dirname + "/cache/setname_backup.json";

if (!fs.existsSync(__dirname + "/cache")) {
	fs.mkdirSync(__dirname + "/cache");
}

if (!fs.existsSync(nicknameDataPath)) {
	fs.writeFileSync(nicknameDataPath, JSON.stringify({}));
}

module.exports.config = {
	name: "setname",
	version: "9.0.1",
	hasPermssion: 0,
	credits: "乛 M𝆠፝֟R ཐི༏ཋྀ JU𝆠፝֟W𝆠፝֟ELꜛཐི༏ཋྀ࿐",
	description: "Advanced বাংলা Nickname System",
	commandCategory: "Box Chat",
	usages: "[reply/@tag/all/reset] [name]",
	cooldowns: 3
};

// ================================
// AUTO BACKUP NICKNAME SYSTEM
// ================================
module.exports.handleEvent = async function ({ api, event }) {

	try {

		if (event.logMessageType !== "log:user-nickname") return;

		const { threadID, logMessageData, author } = event;

		const changedUID = logMessageData.participant_id;
		const newNickname = logMessageData.nickname || "";

		let data = JSON.parse(
			fs.readFileSync(nicknameDataPath)
		);

		if (!data[threadID]) {
			data[threadID] = {};
		}

		// BOT ADMIN CHANGE = ALLOW
		if (global.config.ADMINBOT.includes(author)) {

			data[threadID][changedUID] = newNickname;

			fs.writeFileSync(
				nicknameDataPath,
				JSON.stringify(data, null, 2)
			);

			return;
		}

		// FIRST SAVE
		if (!data[threadID][changedUID]) {

			data[threadID][changedUID] = newNickname;

			fs.writeFileSync(
				nicknameDataPath,
				JSON.stringify(data, null, 2)
			);

			return;
		}

		const oldNickname = data[threadID][changedUID];

		// RESTORE OLD NAME
		await api.changeNickname(
			oldNickname,
			threadID,
			changedUID
		);

		return api.sendMessage(
`╔════════════════════╗
   🛡️ NICKNAME PROTECT
╚════════════════════╝

⚠️ একজন ইউজার অন্য একজনের nickname পরিবর্তন করার চেষ্টা করেছে।

✅ আগের nickname আবার ফিরিয়ে দেওয়া হয়েছে।`,
			threadID
		);

	} catch (e) {
		console.log(e);
	}
};

module.exports.run = async function ({ api, event, args, Users }) {

	try {

		const { threadID, senderID, mentions, messageReply } = event;

		// BAD WORD FILTER
		const badWords = [
			"fuck", "bitch", "sex", "porn",
			"motherfucker", "bastard", "shit",
			"bal", "khanki", "magi", "choda",
			"চোদ", "মাগী", "বাল", "খানকি"
		];

		// Helper: Unicode-aware length check (handles emoji, multi-byte, combining chars)
		const getCharLength = (str) => Array.from(str).length;
		const MAX_NAME_LENGTH = 50; // Facebook's actual safe limit

		if (!args[0]) {

			return api.sendMessage(
`╔════════════════╗
      ⚠️ নাম দিন
╚════════════════╝

📌 উদাহরণ:

.setname Juwel
.setname @user Boss
.setname all Mafia
.setname reset`,
				threadID,
				event.messageID
			);
		}

		let targetUsers = [];
		let newName = args.join(" ");

		// RESET SYSTEM
		if (args[0].toLowerCase() === "reset") {

			// Reply Reset
			if (messageReply) {

				await api.changeNickname(
					"",
					threadID,
					messageReply.senderID
				);

				return api.sendMessage(
`╔════════════════╗
   ✅ নাম রিসেট সফল
╚════════════════╝

👤 রিপ্লাই করা ইউজারের nickname remove করা হয়েছে।`,
					threadID,
					event.messageID
				);
			}

			// Mention Reset
			if (Object.keys(mentions).length > 0) {

				for (const uid of Object.keys(mentions)) {

					await api.changeNickname(
						"",
						threadID,
						uid
					);
				}

				return api.sendMessage(
`╔════════════════╗
   ✅ নাম রিসেট সফল
╚════════════════╝

👥 Mention করা ইউজারদের nickname remove করা হয়েছে।`,
					threadID,
					event.messageID
				);
			}

			// Self Reset
			await api.changeNickname(
				"",
				threadID,
				senderID
			);

			return api.sendMessage(
`╔════════════════╗
   ✅ নিজের নাম রিসেট
╚════════════════╝`,
				threadID,
				event.messageID
			);
		}

		// ALL MEMBER CHANGE
		if (args[0].toLowerCase() === "all") {

			// ONLY BOT ADMIN
			if (!global.config.ADMINBOT.includes(senderID)) {

				return api.sendMessage(
`╔════════════════╗
      ❌ Access Denied
╚════════════════╝

⚠️ শুধুমাত্র Bot Admin এই কমান্ড ব্যবহার করতে পারবে।`,
					threadID,
					event.messageID
				);
			}

			const threadInfo = await api.getThreadInfo(threadID);

			targetUsers = threadInfo.participantIDs;

			newName = args.slice(1).join(" ");

			if (!newName) {

				return api.sendMessage(
`╔════════════════╗
    ⚠️ নাম দিন!
╚════════════════╝

📛 সবার জন্য একটি nickname দিন।`,
					threadID,
					event.messageID
				);
			}

			// BAD WORD CHECK
			const lowerName = newName.toLowerCase();

			for (const word of badWords) {

				if (lowerName.includes(word)) {

					return api.sendMessage(
`╔════════════════╗
    ❌ খারাপ শব্দ!
╚════════════════╝

🚫 এই নাম ব্যবহার করা যাবে না।`,
						threadID,
						event.messageID
					);
				}
			}

			// NAME LIMIT (Unicode-aware)
			if (getCharLength(newName) > MAX_NAME_LENGTH) {

				return api.sendMessage(
`╔════════════════╗
   ⚠️ নাম অনেক বড়!
╚════════════════╝

📛 সর্বোচ্চ ${MAX_NAME_LENGTH} অক্ষরের নাম দিতে পারবেন।`,
					threadID,
					event.messageID
				);
			}

			let success = 0;

			for (const uid of targetUsers) {

				try {

					await api.changeNickname(
						newName,
						threadID,
						uid
					);

					success++;

				} catch (e) {
					console.log("Nickname change failed for", uid, e.message);
				}
			}

			return api.sendMessage(
`╔════════════════════╗
      ✅ ALL SETNAME
╚════════════════════╝

👥 মোট সদস্য:
${targetUsers.length}

✅ সফল হয়েছে:
${success}

📛 নতুন নাম:
${newName}

🎉 গ্রুপের সবার nickname পরিবর্তন করা হয়েছে।`,
				threadID,
				event.messageID
			);
		}

		// BAD WORD CHECK
		const lowerName = newName.toLowerCase();

		for (const word of badWords) {

			if (lowerName.includes(word)) {

				return api.sendMessage(
`╔════════════════╗
    ❌ খারাপ শব্দ!
╚════════════════╝

🚫 এই নাম ব্যবহার করা যাবে না।`,
					threadID,
					event.messageID
				);
			}
		}

		// REPLY USER SUPPORT
		if (messageReply) {

			targetUsers.push(
				messageReply.senderID
			);
		}

		// MULTI USER CHANGE
		else if (Object.keys(mentions).length > 0) {

			targetUsers = Object.keys(mentions);

			for (const uid of targetUsers) {

				newName = newName
					.replace(mentions[uid], "")
					.trim();
			}
		}

		// SELF CHANGE
		else {

			targetUsers.push(senderID);
		}

		if (!newName || newName.length < 1) {

			return api.sendMessage(
`╔════════════════╗
    ⚠️ ভুল নাম!
╚════════════════╝

📛 একটি সঠিক nickname দিন।`,
				threadID,
				event.messageID
			);
		}

		// NAME LIMIT (Unicode-aware)
		if (getCharLength(newName) > MAX_NAME_LENGTH) {

			return api.sendMessage(
`╔════════════════╗
   ⚠️ নাম অনেক বড়!
╚════════════════╝

📛 সর্বোচ্চ ${MAX_NAME_LENGTH} অক্ষরের নাম দিতে পারবেন।`,
				threadID,
				event.messageID
			);
		}

		// CHANGE NICKNAME
		let changeErrors = [];

		for (const uid of targetUsers) {

			try {

				await api.changeNickname(
					newName,
					threadID,
					uid
				);

				// SAVE BACKUP
				let data = JSON.parse(
					fs.readFileSync(nicknameDataPath)
				);

				if (!data[threadID]) {
					data[threadID] = {};
				}

				data[threadID][uid] = newName;

				fs.writeFileSync(
					nicknameDataPath,
					JSON.stringify(data, null, 2)
				);

			} catch (e) {
				console.log("Nickname change failed for", uid, e.message);
				changeErrors.push(uid);
			}
		}

		// IF ALL FAILED
		if (changeErrors.length === targetUsers.length) {

			return api.sendMessage(
`╔════════════════╗
      ❌ Error
╚════════════════╝

⚠️ nickname পরিবর্তন করা যায়নি।
এই নামটি Facebook গ্রহণ করেনি, অন্য একটি নাম চেষ্টা করুন।`,
				threadID,
				event.messageID
			);
		}

		// GET USER NAMES
		let userNames = [];

		for (const uid of targetUsers) {

			try {

				const name = await Users.getNameUser(uid);

				userNames.push(name);

			} catch {

				userNames.push("Unknown User");
			}
		}

		const senderName = await Users.getNameUser(senderID);

		return api.sendMessage(
`╔════════════════════╗
       ✨ SETNAME ✨
╚════════════════════╝

👑 নাম পরিবর্তন করেছে:
${senderName}

📛 নতুন নাম:
${newName}

👥 মোট ইউজার:
${targetUsers.length}

🎯 যাদের নাম পরিবর্তন হয়েছে:
${userNames.join("\n")}

✅ সফলভাবে nickname পরিবর্তন করা হয়েছে`,
			threadID,
			event.messageID
		);

	} catch (e) {

		console.log(e);

		return api.sendMessage(
`╔════════════════╗
      ❌ Error
╚════════════════╝

⚠️ nickname পরিবর্তন করা যায়নি।`,
			event.threadID,
			event.messageID
		);
	}
};
