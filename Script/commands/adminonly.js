const fs = require("fs-extra");
const path = require("path");

module.exports.config = {
	name: "onlyadmin",
	version: "2.0.0",
	hasPermssion: 2, // শুধুমাত্র Bot Admin
	credits: "乛 M𝆠፝֟R ཐི༏ཋྀ JU𝆠፝֟W𝆠፝֟ELꜛཐི༏ཋྀ࿐",
	description: "Bot Admin Only Mode চালু/বন্ধ করুন",
	commandCategory: "Admin",
	usages: "on / off / status",
	cooldowns: 5,
	dependencies: {
		"fs-extra": ""
	}
};

module.exports.onLoad = function () {
	const filePath = path.join(__dirname, "cache", "data.json");

	if (!fs.existsSync(filePath)) {
		fs.writeFileSync(
			filePath,
			JSON.stringify(
				{
					adminbox: {}
				},
				null,
				4
			)
		);
	} else {
		const data = require(filePath);

		if (!data.adminbox) {
			data.adminbox = {};
			fs.writeFileSync(filePath, JSON.stringify(data, null, 4));
		}
	}
};

module.exports.run = async function ({ api, event, args }) {
	const { threadID, messageID } = event;

	const filePath = path.join(__dirname, "cache", "data.json");

	delete require.cache[require.resolve(filePath)];
	const data = require(filePath);

	if (!data.adminbox) data.adminbox = {};

	// STATUS
	if (args[0] == "status") {
		return api.sendMessage(
			{
				body: data.adminbox[threadID]
					? `╔═『 🔒 ADMIN ONLY MODE 』══╗

📊 বর্তমান অবস্থা

✅ Admin Only Mode বর্তমানে চালু রয়েছে।

⚡ কমান্ড ব্যবহার করতে পারবে:
👑 শুধুমাত্র Bot Admin

❌ Group Admin এবং সাধারণ সদস্যরা বট কমান্ড ব্যবহার করতে পারবে না।

╚════════════════════╝`
					: `╔═『 🔓 ADMIN ONLY MODE 』══╗

📊 বর্তমান অবস্থা

✅ Admin Only Mode বর্তমানে বন্ধ রয়েছে।

⚡ কমান্ড ব্যবহার করতে পারবে:
👥 গ্রুপের সকল সদস্য

╚════════════════════╝`
			},
			threadID,
			messageID
		);
	}

	// ON
	if (args[0] == "on") {
		if (data.adminbox[threadID] === true) {
			return api.sendMessage(
				"⚠️ Admin Only Mode আগে থেকেই চালু রয়েছে।",
				threadID,
				messageID
			);
		}

		data.adminbox[threadID] = true;
		fs.writeFileSync(filePath, JSON.stringify(data, null, 4));

		return api.sendMessage(
			{
				body: `╔═『 🔒 ADMIN ONLY MODE 』══╗

📢 গ্রুপ নোটিশ

এই গ্রুপে Admin Only Mode চালু করা হয়েছে।

✅ এখন থেকে শুধুমাত্র Bot Admin বটের সকল কমান্ড ব্যবহার করতে পারবে।

❌ Group Admin এবং সাধারণ সদস্যরা কোনো বট কমান্ড ব্যবহার করতে পারবে না।

💬 তবে সবাই বটের সাথে সাধারণ কথোপকথন করতে পারবে।

⚠️ নিরাপত্তার স্বার্থে Bot Command System শুধুমাত্র Bot Admin-এর জন্য সীমাবদ্ধ করা হয়েছে।

━━━━━━━━━━━━━━━━━━

👑 SYSTEM OWNER
乛 M𝆠፝֟R ཐི༏ཋྀ JU𝆠፝֟W𝆠፝֟ELꜛཐི༏ཋྀ࿐

━━━━━━━━━━━━━━━━━━

🔒 স্ট্যাটাস : চালু
🛡️ নিরাপত্তা : সর্বোচ্চ
⚡ ব্যবহারকারী : শুধুমাত্র Bot Admin

╚════════════════════╝`
			},
			threadID,
			messageID
		);
	}

	// OFF
	if (args[0] == "off") {
		if (!data.adminbox[threadID]) {
			return api.sendMessage(
				"⚠️ Admin Only Mode আগে থেকেই বন্ধ রয়েছে।",
				threadID,
				messageID
			);
		}

		data.adminbox[threadID] = false;
		fs.writeFileSync(filePath, JSON.stringify(data, null, 4));

		return api.sendMessage(
			{
				body: `╔═『 🔓 ADMIN ONLY MODE 』══╗

📢 গ্রুপ নোটিশ

Admin Only Mode সফলভাবে বন্ধ করা হয়েছে।

✅ এখন থেকে গ্রুপের সকল সদস্য বটের সকল কমান্ড ব্যবহার করতে পারবে।

🎉 Bot Command System পুনরায় সবার জন্য চালু করা হয়েছে।

━━━━━━━━━━━━━━━━━━

👑 SYSTEM OWNER
乛 M𝆠፝֟R ཐི༏ཋྀ JU𝆠፝֟W𝆠፝֟ELꜛཐི༏ཋྀ࿐

━━━━━━━━━━━━━━━━━━

🔓 স্ট্যাটাস : বন্ধ
🌐 ব্যবহারকারী : সকল সদস্য

╚════════════════════╝`
			},
			threadID,
			messageID
		);
	}

	// HELP
	return api.sendMessage(
		{
			body: `╔═『 ⚙️ ONLYADMIN HELP 』══╗

📌 কমান্ড ব্যবহার:

🔒 onlyadmin on
➜ Admin Only Mode চালু করবে

🔓 onlyadmin off
➜ Admin Only Mode বন্ধ করবে

📊 onlyadmin status
➜ বর্তমান স্ট্যাটাস দেখাবে

━━━━━━━━━━━━━━━━━━

⚡ Mode চালু থাকলে:
👑 শুধুমাত্র Bot Admin বট কমান্ড ব্যবহার করতে পারবে।

╚════════════════════╝`
		},
		threadID,
		messageID
	);
};
