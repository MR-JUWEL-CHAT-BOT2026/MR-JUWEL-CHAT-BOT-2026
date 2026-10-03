module.exports.config = {
    name: "alluser",
    version: "4.0.0",
    hasPermssion: 0,
    credits: "乛 M𝆠፝֟R ཐི༏ཋྀ JU𝆠፝֟W𝆠፝֟ELꜛཐི༏ཋྀ࿐",
    description: "List all users (Mirai stable)",
    commandCategory: "group",
    usages: "",
    cooldowns: 3
};

module.exports.run = async function ({ api, event }) {
    try {
        const threadInfo = await api.getThreadInfo(event.threadID);

        const users = threadInfo.userInfo;
        const admins = threadInfo.adminIDs.map(item => item.id);

        let adminList = "";
        let memberList = "";

        let a = 0, m = 0;

        for (let user of users) {
            const id = user.id;
            const name = user.name || "Unknown";

            if (admins.includes(id)) {
                a++;
                adminList += `👑 ${a}. ${name}\n🔗 https://facebook.com/${id}\n\n`;
            } else {
                m++;
                memberList += `👤 ${m}. ${name}\n🔗 https://facebook.com/${id}\n\n`;
            }
        }

        const msg = `━━━━━━━━━━━━━━━━━━
👥 𝗚𝗥𝗢𝗨𝗣 𝗨𝗦𝗘𝗥 𝗟𝗜𝗦𝗧
━━━━━━━━━━━━━━━━━━

👑 Admin: ${a}
👤 Members: ${m}
📊 Total: ${users.length}

━━━━━━━━━━━━━━━━━━
👑 𝗔𝗗𝗠𝗜𝗡𝗦
━━━━━━━━━━━━━━━━━━
${adminList || "No Admin"}

━━━━━━━━━━━━━━━━━━
👤 𝗠𝗘𝗠𝗕𝗘𝗥𝗦
━━━━━━━━━━━━━━━━━━
${memberList || "No Members"}
`;

        return api.sendMessage(msg, event.threadID, event.messageID);

    } catch (e) {
        return api.sendMessage("❌ Error: " + e.message, event.threadID, event.messageID);
    }
};
