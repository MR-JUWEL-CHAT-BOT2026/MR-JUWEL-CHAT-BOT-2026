module.exports.config = {
  name: "linkcaption",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "乛 M𝆠፝֟R ཐི༏ཋྀ JU𝆠፝֟W𝆠፝֟ELꜛཐི༏ཋྀ࿐",
  description: "Link Caption",
  commandCategory: "group",
  usages: "",
  cooldowns: 3
};

module.exports.run = async function({ api, event }) {

return api.sendMessage(
`╔════════════════════╗
║ 🎀 LINK CAPTION
╠════════════════════╣

ꕥ̳̳̳̳̳̳̳̿̿̿̿̿⃞ꕥ̳̳̳̳̳̳̳̿̿̿̿̿🅞𝐍🅛𝐈ꜛ🎀⃞⃟ꕥ̳̳̳̳̳̳̳̿̿̿̿̿⤹𝐂🅐𝐏🅣𝐈🅞𝐍⤸⃞ꕥ̳̳̳̳̳̳̳̿̿̿̿̿🩷ꤪ𝐁🅞𝐗⤸⃞🩷ꤪ🪽ꜛ國࿐

🔗 https://m.me/j/AbZBQUk_jHSuVvNt/?send_source=gc%3Acopy_invite_link_c

╚════════════════════╝`,
event.threadID,
event.messageID
);

};
