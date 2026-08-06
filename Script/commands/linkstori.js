module.exports.config = {
  name: "linkstori",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "乛 M𝆠፝֟R ཐི༏ཋྀ JU𝆠፝֟W𝆠፝֟ELꜛཐི༏ཋྀ࿐",
  description: "Link Stori",
  commandCategory: "group",
  usages: "",
  cooldowns: 3
};

module.exports.run = async function({ api, event }) {

return api.sendMessage(
`╔════════════════════╗
║ 📸 LINK STORI
╠════════════════════╣

ꕥ̳̳̳̳̳̳̳̿̿̿̿̿⃞ꕥ̳̳̳̳̳̳̳̿̿̿̿̿🅞𝐍🅛𝐈ꜛ🎀⃞⃟ꕥ̳̳̳̳̳̳̳̿̿̿̿̿⤹🅢𝐓🅞𝐑🅘⤸⃞ꕥ̳̳̳̳̳̳̳̿̿̿̿̿🩷ꤪ🅥𝐈🅓𝐄🅞 ─⃞⤹😽𝐁ꤪ🅞𝐗⤸⃞🩷ꤪ🪽ꜛ國࿐

🔗 https://m.me/j/AbYIJfbxID4P7lSD/?send_source=gc%3Acopy_invite_link_c

╚════════════════════╝`,
event.threadID,
event.messageID
);

};
