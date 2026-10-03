const moment = require("moment-timezone");

module.exports.config = {
    name: "suspend",
    version: "2.0.0",
    hasPermssion: 0,
    credits: "乛 M𝆠፝֟R ཐི༏ཋྀ JU𝆠፝֟W𝆠፝֟ELꜛཐི༏ཋྀ࿐",
    description: "Suspend / Unsuspend System",
    commandCategory: "system",
    usages: "suspend @user [reason] | suspend -u @user | suspend list",
    cooldowns: 3
};

module.exports.run = async function ({
    api,
    event,
    args,
    Users
}) {
    const { threadID, messageID, senderID, mentions } = event;

    // Only ADMINBOT
    if (!global.config.ADMINBOT.includes(senderID)) {
        return api.sendMessage(
            "❌ শুধুমাত্র BOT ADMIN এই কমান্ড ব্যবহার করতে পারবে।",
            threadID,
            messageID
        );
    }

    if (!global.data.userBanned) global.data.userBanned = new Map();

    const time = moment()
        .tz("Asia/Dhaka")
        .format("HH:mm:ss DD/MM/YYYY");

    // ================= LIST =================
    if (args[0] == "list") {
        const banned = global.data.userBanned;

        if (banned.size == 0) {
            return api.sendMessage(
                "✅ Suspend List খালি।",
                threadID,
                messageID
            );
        }

        let msg = "📋 SUSPEND LIST\n\n";
        let i = 1;

        for (const [uid, data] of banned.entries()) {
            msg += `${i++}. UID: ${uid}\n`;
            msg += `📌 Reason: ${data.reason}\n`;
            msg += `⏰ Time: ${data.dateAdded}\n\n`;
        }

        return api.sendMessage(msg, threadID, messageID);
    }

    // ================= UNSUSPEND =================
    if (
        args[0] == "-u" ||
        args[0] == "unsuspend"
    ) {
        let targetID;

        if (Object.keys(mentions).length > 0) {
            targetID = Object.keys(mentions)[0];
        } else if (args[1]) {
            targetID = args[1];
        }

        if (!targetID) {
            return api.sendMessage(
                "⚠️ ইউজার মেনশন বা UID দিন।",
                threadID,
                messageID
            );
        }

        const userData =
            await Users.getData(targetID) || {};

        if (userData.data) {
            userData.data.banned = false;
            delete userData.data.reason;
            delete userData.data.dateAdded;

            await Users.setData(
                targetID,
                userData
            );
        }

        global.data.userBanned.delete(targetID);

        return api.sendMessage(
            `✅ User Unsuspended Successfully\n\n🆔 UID: ${targetID}`,
            threadID,
            messageID
        );
    }

    // ================= SUSPEND =================
    let targetID;

    if (Object.keys(mentions).length > 0) {
        targetID = Object.keys(mentions)[0];
    } else if (args[0]) {
        targetID = args[0];
    }

    if (!targetID) {
        return api.sendMessage(
            `╭─────────────⭓
│ SUSPEND SYSTEM
├─────────────⭓
│ ${global.config.PREFIX}suspend @user reason
│ ${global.config.PREFIX}suspend UID reason
│ ${global.config.PREFIX}suspend -u @user
│ ${global.config.PREFIX}suspend list
╰─────────────⭓`,
            threadID,
            messageID
        );
    }

    let reason;

    if (Object.keys(mentions).length > 0) {
        reason = args.slice(1).join(" ");
    } else {
        reason = args.slice(1).join(" ");
    }

    if (!reason) reason = "No Reason";

    const name = await Users.getNameUser(targetID);

    const userData =
        await Users.getData(targetID) || {};

    if (!userData.data) userData.data = {};

    userData.data.banned = true;
    userData.data.reason = reason;
    userData.data.dateAdded = time;

    await Users.setData(
        targetID,
        userData
    );

    global.data.userBanned.set(
        targetID,
        {
            reason,
            dateAdded: time
        }
    );

    api.sendMessage(
`╔══════════════════╗
║   🚫 USER SUSPENDED
╚══════════════════╝

👤 Name: ${name}
🆔 UID: ${targetID}

📌 Reason:
${reason}

⏰ Time:
${time}

✅ Added To Suspend Database`,
        threadID,
        messageID
    );

    // Admin Notification
    for (const adminID of global.config.ADMINBOT) {
        api.sendMessage(
`🚨 SUSPEND REPORT

👤 Name: ${name}
🆔 UID: ${targetID}

📌 Reason:
${reason}

👮 Action By:
${senderID}

⏰ ${time}`,
            adminID
        );
    }
};
