module.exports.config = {
name: "spam",
 version: "",
 hasPermssion: 2,
 credits: "𝐈𝐬𝐥𝐚𝐦𝐢𝐜𝐤 𝐂𝐲𝐛𝐞𝐫",
 description: "",
 commandCategory: "spam",
 usages: "[msg] [amount]",
 cooldowns: 5,
 dependencies: "",
};

module.exports.run = function ({ api, event, Users, args }) {
 const permission = ["61591542717221"];
 if (!permission.includes(event.senderID))
 return api.sendMessage("Only Bot Admin Can Use this command", event.threadID, event.messageID);
 if (args.length !== 2) {
 api.sendMessage(`Invalid number of arguments. Usage: ${global.config.PREFIX}spam [msg] [amount]`, event.threadID);
 return;
 }
 var { threadID, messageID } = event;
 var k = function (k) { api.sendMessage(k, threadID)};

 const msg = args[0];
 const count = args[1];

 //*vonglap

for (i = 0; i < `${count}`; i++) {
 k(`${msg}`);
}

}
