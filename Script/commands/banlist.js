module.exports.config = {
  name: "banlist",
  version: "2.0.0",
  hasPermssion: 1,
  credits: "𝐌𝐑 𝐉𝐔𝐖𝐄𝐋",
  description: "Show banned users with pagination",
  commandCategory: "group",
  usages: "banlist [page]",
  cooldowns: 5
};

module.exports.run = async ({ api, event, args, Users }) => {
  const { threadID, messageID } = event;

  let page = parseInt(args[0]) || 1;
  let perPage = 5;

  let list = global.data.userBanned;
  if (!list || list.size === 0)
    return api.sendMessage("✅ কোনো banned user নেই", threadID, messageID);

  let all = Array.from(list.entries());

  let totalPage = Math.ceil(all.length / perPage);
  if (page > totalPage) page = totalPage;
  if (page < 1) page = 1;

  let start = (page - 1) * perPage;
  let end = start + perPage;

  let slice = all.slice(start, end);

  let msg =
`╔══════════════╗
║ 🚫 BAN LIST ║
╚══════════════╝
📄 Page: ${page}/${totalPage}
━━━━━━━━━━━━━━\n`;

  for (let [uid, info] of slice) {
    let name = global.data.userName.get(uid) || await Users.getNameUser(uid);

    msg +=
`👤 ${name}
🆔 ${uid}
📄 ${info.reason || "No reason"}
🕒 ${info.dateAdded || "Unknown"}
━━━━━━━━━━━━━━\n`;
  }

  msg += `👉 ব্যবহার: banlist ${page + 1}`;

  return api.sendMessage(msg, threadID, messageID);
};
