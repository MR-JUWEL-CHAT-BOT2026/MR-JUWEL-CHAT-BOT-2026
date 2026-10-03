module.exports.config = {
	name: "god",
	eventType: [
		"log:unsubscribe",
		"log:subscribe",
		"log:thread-name",
		"log:thread-admins",
		"log:user-nickname",
		"log:thread-icon",
		"log:thread-image"
	],
	version: "4.4.0",
	credits: "乛 M𝆠፝֟R ཐི༏ཋྀ JU𝆠፝֟W𝆠፝֟ELꜛཐི༏ཋྀ࿐",
	description: "Ultra Pro Group Logger | Dhaka Timezone",
	envConfig: {
		enable: true,
		cooldown: 30,
		dailyReportTime: "00:00"
	}
};

// ================= GLOBAL STORAGE =================
if (!global.godLoggerCooldown) global.godLoggerCooldown = {};
if (!global.godLoggerStats) global.godLoggerStats = {};
if (!global.godLoggerLastIcon) global.godLoggerLastIcon = {};
if (!global.godLoggerDailyStarted) global.godLoggerDailyStarted = false;

const INBOXES = [
	"61594400795920",
	"61591542717221"
];

// ================= DHAKA TIME HELPER =================
function dhakaTime() {
	return new Date().toLocaleString("en-GB", {
		timeZone: "Asia/Dhaka",
		day: "2-digit",
		month: "2-digit",
		year: "numeric",
		hour: "2-digit",
		minute: "2-digit",
		second: "2-digit",
		hour12: true
	}).replace(",", "");
}

function dhakaTimeShort() {
	return new Date().toLocaleString("en-GB", {
		timeZone: "Asia/Dhaka",
		hour: "2-digit",
		minute: "2-digit",
		hour12: true
	});
}

function dhakaDate() {
	return new Date().toLocaleString("en-GB", {
		timeZone: "Asia/Dhaka",
		day: "2-digit",
		month: "2-digit",
		year: "numeric"
	});
}

// ================= DAILY SUMMARY =================
function startDailyScheduler(api) {
	if (global.godLoggerDailyStarted) return;
	global.godLoggerDailyStarted = true;

	setInterval(async () => {
		const now = new Date().toLocaleString("en-GB", {
			timeZone: "Asia/Dhaka",
			hour: "2-digit",
			minute: "2-digit",
			hour12: false
		});

		const targetTime = global.configModule?.god?.dailyReportTime || "00:00";
		if (now !== targetTime) return;

		const stats = global.godLoggerStats || {};
		const groups = Object.keys(stats);
		if (!groups.length) return;

		let report = `╔══════════════════════╗\n`;
		report += `║ 📊 DAILY GROUP REPORT ║\n`;
		report += `╠══════════════════════╣\n`;

		for (const tid of groups) {
			const s = stats[tid];
			let gName = s.name || tid;
			try {
				const info = await api.getThreadInfo(tid);
				gName = info.threadName || gName;
			} catch {}

			report += `\n📌 ${gName}\n`;
			report += `   👢 Kicked    : ${s.kicked || 0}\n`;
			report += `   👑 Admin +/- : ${s.adminAdd || 0}/${s.adminRemove || 0}\n`;
			report += `   ✏️ Nick Chg  : ${s.nick || 0}\n`;
			report += `   🏷️ Name Chg  : ${s.nameChg || 0}\n`;
			report += `   😆 Icon Chg  : ${s.icon || 0}\n`;
			report += `   🖼️ Photo Chg : ${s.photo || 0}\n`;
		}

		report += `\n╚══════════════════════╝\n`;
		report += `🕒 ${dhakaTime()} (Dhaka)`;

		for (const id of INBOXES) {
			try { await api.sendMessage(report, id); } catch {}
		}

		global.godLoggerStats = {};
	}, 60 * 1000);
}

// ================= STAT HELPER =================
function bumpStat(tid, key, groupName) {
	if (!global.godLoggerStats[tid]) {
		global.godLoggerStats[tid] = {
			name: groupName,
			kicked: 0,
			adminAdd: 0, adminRemove: 0,
			nick: 0, nameChg: 0, icon: 0, photo: 0
		};
	}
	global.godLoggerStats[tid].name = groupName;
	global.godLoggerStats[tid][key] = (global.godLoggerStats[tid][key] || 0) + 1;
}

// ================= MAIN =================
module.exports.run = async function ({ api, event }) {

	if (!global.configModule?.[this.config.name]?.enable) return;

	startDailyScheduler(api);

	// ============ 30s COOLDOWN ============
	const COOLDOWN = (global.configModule?.[this.config.name]?.cooldown || 30) * 1000;
	const cdKey = `${event.threadID}_${event.logMessageType}`;
	const now = Date.now();

	if (global.godLoggerCooldown[cdKey] && now - global.godLoggerCooldown[cdKey] < COOLDOWN) {
		return;
	}
	global.godLoggerCooldown[cdKey] = now;
	// ======================================

	// 🕒 ঢাকার সময়
	const time = dhakaTime();
	const timeShort = dhakaTimeShort();
	const date = dhakaDate();

	let msg = "";

	try {
		const threadInfo = await api.getThreadInfo(event.threadID);
		const groupName = threadInfo.threadName || "Unknown Group";

		async function getName(uid) {
			try {
				const data = await api.getUserInfo(uid);
				return data[uid]?.name || "Unknown";
			} catch {
				return "Unknown";
			}
		}

		// ============ GROUP NAME ============
		if (event.logMessageType == "log:thread-name") {
			const changer = await getName(event.author);
			bumpStat(event.threadID, "nameChg", groupName);

			msg =
`╔════════════════════╗
║ 🏷️ GROUP NAME UPDATE ║
╠════════════════════╣
║ 📌 Group : ${groupName}
║ ⚡ Changed By : ${changer}
║ 🆔 TID : ${event.threadID}
╚════════════════════╝
🇧🇩 ঢাকা | ${time}`;
		}

		// ============ ADMIN UPDATE ============
		if (event.logMessageType == "log:thread-admins") {
			const targetID = event.logMessageData?.TARGET_ID;
			const action = event.logMessageData?.ADMIN_EVENT;

			const adminName = await getName(event.author);
			const targetName = await getName(targetID);

			if (action == "add_admin") {
				bumpStat(event.threadID, "adminAdd", groupName);
				msg =
`╔════════════════════╗
║ 👑 NEW ADMIN ADDED ║
╠════════════════════╣
║ 📌 Group : ${groupName}
║ 👤 User : ${targetName}
║ ⚡ Added By : ${adminName}
╚════════════════════╝
🇧🇩 ঢাকা | ${time}`;
			}

			if (action == "remove_admin") {
				bumpStat(event.threadID, "adminRemove", groupName);
				msg =
`╔══════════════════════╗
║ 🚫 ADMIN REMOVED ║
╠══════════════════════╣
║ 📌 Group : ${groupName}
║ 👤 Removed : ${targetName}
║ ⚡ Removed By : ${adminName}
╚══════════════════════╝
🇧🇩 ঢাকা | ${time}`;
			}
		}

		// ============ NICKNAME ============
		if (event.logMessageType == "log:user-nickname") {
			const targetID = event.logMessageData?.participant_id;
			const newNick = event.logMessageData?.nickname || "Removed";

			const changer = await getName(event.author);
			const targetName = await getName(targetID);
			bumpStat(event.threadID, "nick", groupName);

			msg =
`╔════════════════════╗
║ ✏️ NICKNAME UPDATE ║
╠════════════════════╣
║ 📌 Group : ${groupName}
║ 👤 User : ${targetName}
║ 📝 New Nick : ${newNick}
║ ⚡ Changed By : ${changer}
╚════════════════════╝
🇧🇩 ঢাকা | ${time}`;
		}

		// ============ EMOJI (Old vs New) ============
		if (event.logMessageType == "log:thread-icon") {
			const changer = await getName(event.author);
			const newIcon = event.logMessageData?.thread_icon || "❓";
			const oldIcon = global.godLoggerLastIcon[event.threadID] || "❓";

			global.godLoggerLastIcon[event.threadID] = newIcon;
			bumpStat(event.threadID, "icon", groupName);

			msg =
`╔════════════════════════╗
║ 😆 GROUP EMOJI UPDATE ║
╠════════════════════════╣
║ 📌 Group : ${groupName}
║ 🔄 Old Emoji : ${oldIcon}
║ ✨ New Emoji : ${newIcon}
║ ⚡ Changed By : ${changer}
╚════════════════════════╝
🇧🇩 ঢাকা | ${time}`;
		}

		// ============ PHOTO ============
		if (event.logMessageType == "log:thread-image") {
			const changer = await getName(event.author);
			bumpStat(event.threadID, "photo", groupName);

			msg =
`╔════════════════════╗
║ 🖼️ GROUP PHOTO UPDATE ║
╠════════════════════╣
║ 📌 Group : ${groupName}
║ ⚡ Changed By : ${changer}
║ 🆔 Thread : ${event.threadID}
╚════════════════════╝
🇧🇩 ঢাকা | ${time}`;
		}

		// ================= MEMBER REMOVED (KICK ONLY) =================
		if (event.logMessageType == "log:unsubscribe") {

			const leftID = event.logMessageData?.leftParticipantFbId;
			const author = event.author;

			const isSelfLeave = (leftID && author && leftID == author);
			if (isSelfLeave) {
				return; // 🚫 নিজে লিভ → কিছুই হবে না
			}

			const leftName = await getName(leftID);
			const remover = author ? await getName(author) : "Unknown";

			// ============ ANTI-BOT-KICK ============
			if (leftID == api.getCurrentUserID()) {
				bumpStat(event.threadID, "kicked", groupName);

				const alertMsg =
`╔════════════════════════╗
║ 🚨 BOT KICKED ALERT 🚨 ║
╠════════════════════════╣
║ 📌 Group : ${groupName}
║ 🆔 TID   : ${event.threadID}
║ ⚡ Kicked By : ${remover}
║ 🤖 Rejoining... please wait
╚════════════════════════╝
🇧🇩 ঢাকা | ${time}`;

				for (const id of INBOXES) {
					try { await api.sendMessage(alertMsg, id); } catch {}
				}

				try {
					await api.addUserToGroup(api.getCurrentUserID(), event.threadID);
				} catch (e) {
					console.log("Rejoin failed:", e.message);
				}
				return;
			}
			// =======================================

			bumpStat(event.threadID, "kicked", groupName);

			msg =
`╔════════════════════╗
║ 👢 MEMBER KICKED ║
╠════════════════════╣
║ 📌 Group : ${groupName}
║ 👤 User : ${leftName}
║ ⚡ Kicked By : ${remover}
╚════════════════════╝
🇧🇩 ঢাকা | ${time}`;
		}

		// ============ BOT ADDED (only bot) ============
		if (event.logMessageType == "log:subscribe") {
			const added = event.logMessageData?.addedParticipants || [];

			const botAdded = added.some(i => i.userFbId == api.getCurrentUserID());
			if (!botAdded) return;

			const adder = await getName(event.author);

			msg =
`╔════════════════════╗
║ 🤖 BOT ADDED ║
╠════════════════════╣
║ 📌 Group : ${groupName}
║ 🆔 TID : ${event.threadID}
║ 👥 Members : ${threadInfo.participantIDs.length}
║ 👤 Added By : ${adder}
╚════════════════════╝
🇧🇩 ঢাকা | ${time}`;
		}

		if (!msg) return;

		for (const id of INBOXES) {
			try { await api.sendMessage(msg, id); } catch {}
		}

	} catch (err) {
		console.log(err);
	}
};
