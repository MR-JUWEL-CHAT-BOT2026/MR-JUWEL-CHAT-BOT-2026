module.exports.config = {
  name: "linksupport",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "乛 M𝆠፝֟R ཐི༏ཋྀ JU𝆠፝֟W𝆠፝֟ELꜛཐི༏ཋྀ࿐",
  description: "Link Support",
  commandCategory: "group",
  usages: "",
  cooldowns: 3
};

module.exports.run = async function({ api, event }) {

return api.sendMessage(
`╔════════════════════╗
║ 🛠️ LINK SUPPORT
╠════════════════════╣

ꕥ̳̳̳̳̳̳̳̿̿̿̿̿⃞⃟ꕥ̳̳̳̳̳̳̳̿̿̿̿̿⃞⃟⁽𝐁𝆠፝֟𝐃ꕥ̳̳̳̳̳̳̳̿̿̿̿̿⃞𝐁𝆠፝֟🅞𝆠፝֟𝐓ꕥ̳̳̳̳̳̳̳̿̿̿̿̿⃞𝐅𝐀𝆠፝֟🅜𝆠፝֟𝐈𝐋𝐘ꕥ̳̳̳̳̳̳̳̿̿̿̿̿⃞𝐁𝆠፝֟🅞𝆠፝֟𝐗⤸⃞ꕥ̳̳̳̳̳̳̳̿̿̿̿̿ꜛ國🩷ꤪ🪽

🔗 https://m.me/j/AbYdxzTiNmPFPZ6u/?send_source=gc%3Acopy_invite_link_c

╚════════════════════╝`,
event.threadID,
event.messageID
);

};
