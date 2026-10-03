module.exports.config = {
  name: "linknickname",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "乛 M𝆠፝֟R ཐི༏ཋྀ JU𝆠፝֟W𝆠፝֟ELꜛཐི༏ཋྀ࿐",
  description: "Link Nickname",
  commandCategory: "group",
  usages: "",
  cooldowns: 3
};

module.exports.run = async function({ api, event }) {

return api.sendMessage(
`╔════════════════════╗
║ 🏷️ LINK NICKNAME
╠════════════════════╣

ꕥ̳̳̳̳̳̳̳̿̿̿̿̿⃞ꕥ̳̳̳̳̳̳̳̿̿̿̿̿🅞𝐍🅛𝐈ꜛ🎀⃞⃟ꕥ̳̳̳̳̳̳̳̿̿̿̿̿⤹🅝𝐈🅒𝐊⤸⃞ꕥ̳̳̳̳̳̳̳̿̿̿̿̿🩷ꤪ🅝𝐀🅜𝐄─⃞⤹😽ꤪ𝐁🅞𝐗 ⤸⃞🩷ꤪ🪽ꜛ國࿐

🔗 https://m.me/j/AbbrH-mYmtBGbssc/?send_source=gc%3Acopy_invite_link_c

╚════════════════════╝`,
event.threadID,
event.messageID
);

};
