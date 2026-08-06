module.exports.config = {
 name: 'allbox',
 version: '2.0.1',
 credits: '𝐌𝐑 𝐉𝐔𝐖𝐄𝐋',
 hasPermssion: 2,
 description: '[Ban/Unban/Del/Out] Manage all group threads',
 commandCategory: 'Admin',
 usages: '[page/all]',
 cooldowns: 5
};

module.exports.handleReply = async function ({ api, event, Threads, handleReply }) {
 const { threadID } = event;
 if (parseInt(event.senderID) !== parseInt(handleReply.author)) return;

 const moment = require("moment-timezone");
 const time = moment.tz("Asia/Dhaka").format("HH:mm:ss | DD/MM/YYYY");

 const args = event.body.split(" ");
 const index = parseInt(args[1]) - 1;

 if (isNaN(index) || !handleReply.groupid[index]) {
 return api.sendMessage("❌ │ Invalid number!", threadID);
 }

 const idgr = handleReply.groupid[index];
 const groupName = handleReply.groupName[index];
 const action = args[0].toLowerCase();

 try {

 if (action === "ban") {
 const data = (await Threads.getData(idgr)).data || {};
 data.banned = 1;
 data.dateAdded = time;

 await Threads.setData(idgr, { data });
 global.data.threadBanned.set(idgr, { dateAdded: time });

 return api.sendMessage(
`╭───〔 🚫 𝐁𝐀𝐍 𝐒𝐔𝐂𝐂𝐄𝐒𝐒 〕───╮
│
│ 🔷 Name : ${groupName}
│ 🔰 TID : ${idgr}
│ ⏰ Time : ${time}
│
╰────────────────────╯`, threadID);
 }

 if (["unban", "ub"].includes(action)) {
 const data = (await Threads.getData(idgr)).data || {};
 data.banned = 0;
 data.dateAdded = null;

 await Threads.setData(idgr, { data });
 global.data.threadBanned.delete(idgr);

 return api.sendMessage(
`╭───〔 ✅ 𝐔𝐍𝐁𝐀𝐍 〕───╮
│
│ 🔷 Name : ${groupName}
│ 🔰 TID : ${idgr}
│ ⏰ Time : ${time}
│
╰────────────────╯`, threadID);
 }

 if (action === "del") {
 await Threads.delData(idgr);

 return api.sendMessage(
`╭───〔 🗑️ 𝐃𝐄𝐋𝐄𝐓𝐄 〕───╮
│
│ 🔷 Name : ${groupName}
│ 🔰 TID : ${idgr}
│
│ ✔ Data Removed Successfully
│
╰────────────────╯`, threadID);
 }

 if (action === "out") {
 api.sendMessage(
`╭───〔 👋 𝐋𝐄𝐀𝐕𝐈𝐍𝐆 〕───╮
│ 🔷 ${groupName}
╰────────────────╯`,
 idgr,
 () => api.removeUserFromGroup(api.getCurrentUserID(), idgr)
 );

 return api.sendMessage(
`╭───〔 ✅ 𝐎𝐔𝐓 〕───╮
│
│ 🔷 Name : ${groupName}
│ 🔰 TID : ${idgr}
│
╰────────────────╯`, threadID);
 }

 } catch (e) {
 console.log(e);
 return api.sendMessage("❌ │ Error occurred!", threadID);
 }
};

module.exports.run = async function ({ api, event, args }) {
 let threadList = [];

 try {
 const data = await api.getThreadList(100, null, ["INBOX"]);

 for (const thread of data) {
 if (thread.isGroup) {
 threadList.push({
 name: thread.name || "No Name",
 id: thread.threadID,
 count: thread.messageCount
 });
 }
 }

 } catch (e) {
 console.log(e);
 }

 if (!threadList.length) {
 return api.sendMessage("❌ │ No group found!", event.threadID);
 }

 threadList.sort((a, b) => b.count - a.count);

 let page = 1;
 let limit = 30;

 if (args[0] && args[0].toLowerCase() !== "all") {
 page = parseInt(args[0]) || 1;
 }

 let totalPage = Math.ceil(threadList.length / limit);
 let groups = args[0] === "all"
 ? threadList
 : threadList.slice((page - 1) * limit, page * limit);

 let msg =
`╭━━━〔 📦 𝐆𝐑𝐎𝐔𝐏 𝐋𝐈𝐒𝐓 〕━━━╮
│ 🔢 Total : ${threadList.length}
╰━━━━━━━━━━━━━━━━━━╯

`;

 let groupid = [];
 let groupName = [];

 groups.forEach((g, i) => {
 msg +=
`╭─❍ ${i + 1}. ${g.name}
│ 🔰 TID : ${g.id}
│ 💬 Msg : ${g.count}
╰───────────────╯

`;
 groupid.push(g.id);
 groupName.push(g.name);
 });

 if (args[0] !== "all") {
 msg += `📄 Page : ${page}/${totalPage}\n`;
 }

 msg += `
╭───〔 ⚙️ 𝐂𝐎𝐌𝐌𝐀𝐍𝐃 〕───╮
│ ban + number
│ unban + number
│ del + number
│ out + number
╰──────────────────╯`;

 return api.sendMessage(msg, event.threadID, (err, info) => {
 global.client.handleReply.push({
 name: this.config.name,
 author: event.senderID,
 messageID: info.messageID,
 groupid,
 groupName,
 type: "reply"
 });
 });
};
