module.exports.config = {
 name: "viewcode",
 version: "1.0.0",
 hasPermssion: 2,
 credits: "乛 M𝆠፝֟R ཐི༏ཋྀ JU𝆠፝֟W𝆠፝֟ELꜛཐི༏ཋྀ࿐",
 description: "কমান্ড ফাইল এর কোড দেখায়",
 commandCategory: "Admin",
 usages: "viewcode <ফাইলের নাম>",
 cooldowns: 5
};

module.exports.run = async function({ api, event, args }) {
 const fs = require("fs-extra");
 const path = require("path");
 
 if (!args[0]) {
   return api.sendMessage("⚠️ ফাইলের নাম দিন!\nউদাহরণ: viewcode help", event.threadID);
 }

 const fileName = args[0] + ".js";
 const filePath = path.join(__dirname, fileName);

 if (!fs.existsSync(filePath)) {
   return api.sendMessage(`❌ "${fileName}" ফাইলটি পাওয়া যায়নি!`, event.threadID);
 }

 const code = fs.readFileSync(filePath, "utf8");

 // শুধু প্লেইন কোড
 api.sendMessage(code, event.threadID);
}
