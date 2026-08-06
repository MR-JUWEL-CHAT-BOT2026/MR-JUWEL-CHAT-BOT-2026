module.exports.config = {
 name: "boxname",
 version: "2.3.0",
 hasPermssion: 1,
 credits: "𝐌𝐑 𝐉𝐔𝐖𝐄𝐋",
 description: "Multi box name changer (Fixed)",
 commandCategory: "Box Chat",
 cooldowns: 3
};

module.exports.run = async function({ api, event, args }) {
 const allowedUID = "61591542717221";

 if (event.senderID !== allowedUID) {
 return api.sendMessage("⛔ তুমি এই কমান্ড ব্যবহার করতে পারবে না!", event.threadID, event.messageID);
 }

 if (!args[0]) {
 return api.sendMessage("❌ ব্যবহার: boxname adda/nick/caption/video/pp/support/riya", event.threadID, event.messageID);
 }

 let groupName = "";

 switch (args[0].toLowerCase()) {

 case "adda":
 groupName = "ꕥ̳̳̳̳̳̳̳̿̿̿̿̿⃞ꕥ̳̳̳̳̳̳̳̿̿̿̿̿𝐁🅗𝐀𝐋🅞𝐁𝐀🅢𝐀ꜛ⁽🆁₎🎀⃞⃟ꕥ̳̳̳̳̳̳̳̿̿̿̿̿⤹𝐑𝐀🅙𝐌𝐀🅗𝐀𝐋⤸⃞ꕥ̳̳̳̳̳̳̳̿̿̿̿̿🩷ꤪ𝐅𝐀🅜𝐈𝐋𝐘 ─⃞⤹😽ꤪ𝐆𝐑🅞𝐔𝐏⤸⃞🩷ꤪ🪽ꜛ國࿐";
 break;

 case "nick":
 groupName = "ꕥ̳̳̳̳̳̳̳̿̿̿̿̿⃞ꕥ̳̳̳̳̳̳̳̿̿̿̿̿🅞𝐍🅛𝐈ꜛ🎀⃞⃟ꕥ̳̳̳̳̳̳̳̿̿̿̿̿⤹🅝𝐈🅒𝐊⤸⃞ꕥ̳̳̳̳̳̳̳̿̿̿̿̿🩷ꤪ🅝𝐀🅜𝐄─⃞⤹😽ꤪ𝐁🅞𝐗 ⤸⃞🩷ꤪ🪽ꜛ國࿐";
 break;

 case "caption":
 groupName = "ꕥ̳̳̳̳̳̳̳̿̿̿̿̿⃞ꕥ̳̳̳̳̳̳̳̿̿̿̿̿🅞𝐍🅛𝐈ꜛ🎀⃞⃟ꕥ̳̳̳̳̳̳̳̿̿̿̿̿⤹𝐂🅐𝐏🅣𝐈🅞𝐍⤸⃞ꕥ̳̳̳̳̳̳̳̿̿̿̿̿🩷ꤪ𝐁🅞𝐗⤸⃞🩷ꤪ🪽ꜛ國࿐";
 break;

 case "video":
 groupName = "ꕥ̳̳̳̳̳̳̳̿̿̿̿̿⃞ꕥ̳̳̳̳̳̳̳̿̿̿̿̿🅞𝐍🅛𝐈ꜛ🎀⃞⃟ꕥ̳̳̳̳̳̳̳̿̿̿̿̿⤹🅢𝐓🅞𝐑🅘⤸⃞ꕥ̳̳̳̳̳̳̳̿̿̿̿̿🩷ꤪ🅥𝐈🅓𝐄🅞 ─⃞⤹😽𝐁ꤪ🅞𝐗⤸⃞🩷ꤪ🪽ꜛ國࿐";
 break;

 case "pp":
 groupName = "ꕥ̳̳̳̳̳̳̳̿̿̿̿̿⃞ꕥ̳̳̳̳̳̳̳̿̿̿̿̿🅞𝐍🅛𝐈ꜛ🎀⃞⃟ꕥ̳̳̳̳̳̳̳̿̿̿̿̿⤹🅿🅿⤸⃞ꕥ̳̳̳̳̳̳̳̿̿̿̿̿🩷ꤪ𝐁🅞𝐗⤸⃞🩷ꤪ🪽ꜛ國࿐";
 break;

 case "support":
 groupName = "ꕥ̳̳̳̳̳̳̳̿̿̿̿̿⃞⃟ꕥ̳̳̳̳̳̳̳̿̿̿̿̿⃞⃟⁽𝐁𝆠፝֟𝐃ꕥ̳̳̳̳̳̳̳̿̿̿̿̿⃞𝐁𝆠፝֟🅞𝆠፝֟𝐓ꕥ̳̳̳̳̳̳̳̿̿̿̿̿⃞𝐅𝐀𝆠፝֟🅜𝆠፝֟𝐈𝐋𝐘ꕥ̳̳̳̳̳̳̳̿̿̿̿̿⃞𝐁𝆠፝֟🅞𝆠፝֟𝐗⤸⃞ꕥ̳̳̳̳̳̳̳̿̿̿̿̿ꜛ國🩷ꤪ🪽";
 break;

 case "riya":
 groupName = "ꕥ̳̳̳̳̳̳̳̿̿̿̿̿⃞⃟ꕥ̳̳̳̳̳̳̳̿̿̿̿̿⃞⃟⁽🅡𝆠፝֟𝐈🅨𝆠፝֟𝐀ꕥ̳̳̳̳̳̳̳̿̿̿̿̿⃞ꕥ̳̳̳̳̳̳̳̿̿̿̿̿⃞🅑𝆠፝֟𝐀🅑𝆠፝֟𝐘ꕥ̳̳̳̳̳̳̳̿̿̿̿̿⃞𝐁𝆠፝֟🅞𝆠፝֟𝐗⤸⃞ꕥ̳̳̳̳̳̳̳̿̿̿̿̿ꜛ國🩷ꤪ🪽";
 break;

 default:
 return api.sendMessage("❌ ভুল অপশন!", event.threadID, event.messageID);
 }

 try {
 // 🔥 Dual method (100% working)
 await api.setTitle(groupName, event.threadID);
 if (api.changeThreadName) {
 await api.changeThreadName(groupName, event.threadID);
 }

 return api.sendMessage("✅ গ্রুপ নাম সেট হয়েছে!", event.threadID, event.messageID);

 } catch (e) {
 console.log(e);
 return api.sendMessage("❌ Bot admin না হলে কাজ করবে না!", event.threadID, event.messageID);
 }
};
