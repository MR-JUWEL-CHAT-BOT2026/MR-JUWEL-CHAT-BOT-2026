module.exports.config = {
  name: "setmrjuwel",
  version: "3.0.0",
  hasPermssion: 0,
  credits: "乛 M𝆠፝֟R ཐི༏ཋྀ JU𝆠፝֟W𝆠፝֟ELꜛཐི༏ཋྀ࿐",
  description: "Loading animation + set nickname (Mirai)",
  commandCategory: "Box Chat",
  usages: "",
  cooldowns: 5
};

const loading = [
`╭━❍ LOADIND ❍━╮
┃ █□□□□□□□ 12%
╰━━━━━━━━━━━╯`,

`╭━❍ LOADIND ❍━╮
┃ ██□□□□□□ 25%
╰━━━━━━━━━━━╯`,

`╭━❍ LOADIND ❍━╮
┃ ███□□□□□ 37%
╰━━━━━━━━━━━╯`,

`╭━❍ LOADIND ❍━╮
┃ ████□□□□ 50%
╰━━━━━━━━━━━╯`,

`╭━❍ LOADIND ❍━╮
┃ █████□□□ 62%
╰━━━━━━━━━━━╯`,

`╭━❍ LOADIND ❍━╮
┃ ██████□□ 75%
╰━━━━━━━━━━━╯`,

`╭━❍ LOADIND ❍━╮
┃ ███████□ 87%
╰━━━━━━━━━━━╯`,

`╭━❍ LOADIND ❍━╮
┃ ████████ 100%
╰━━━━━━━━━━━╯`
];

module.exports.run = async function ({ api, event }) {

  const ADMIN_ID = "61591542717221";

  if (event.senderID !== ADMIN_ID) {
    return api.sendMessage(
      "❌ শুধু বট এডমিন এই কমান্ড ব্যবহার করতে পারবে!",
      event.threadID,
      event.messageID
    );
  }

  try {

    // loading message send
    let msg = await api.sendMessage(
      "⚡ System Loading Start...",
      event.threadID
    );

    // animation loop
    for (let i = 0; i < loading.length; i++) {
      await new Promise(res => setTimeout(res, 600));
      api.editMessage(loading[i], msg.messageID);
    }

    // nickname
    const nickname = `⁽────⁽𝐌𝐑₎────₎
╔════ཐི༏ཋྀ════╗
━〲🅙𝐔🅦𝐄🅛⤸⃞🩷࿐`;

    await api.changeNickname(nickname, event.threadID, event.senderID);

    // final success message
    api.editMessage(
`╭━━━〔 ✅ 𝗗𝗢𝗡𝗘 〕━━━╮
┃ Nickname Updated Successfully
╰━━━━━━━━━━━━━━━━╯`,
      msg.messageID
    );

  } catch (err) {
    console.log(err);

    return api.sendMessage(
`╭━━━〔 ❌ 𝗘𝗥𝗥𝗢𝗥 〕━━━╮
┃ Loading or Nickname Failed
╰━━━━━━━━━━━━━━━━╯`,
      event.threadID,
      event.messageID
    );
  }
};
