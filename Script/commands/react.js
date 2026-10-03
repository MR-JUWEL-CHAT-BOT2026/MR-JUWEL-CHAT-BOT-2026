module.exports.config = {
  name: "react",
  version: "2.0.0",
  hasPermssion: 0,
  credits: "乛 M𝆠፝֟R ཐི༏ཋྀ JU𝆠፝֟W𝆠፝֟ELꜛཐི༏ཋྀ࿐",
  description: "🦵 React দিয়ে silent leave/kick",
  commandCategory: "System",
  usages: "react",
  cooldowns: 0
};

module.exports.handleEvent = async function({ api, event }) {
  try {
    // শুধু মেসেজ রিঅ্যাকশন ইভেন্ট ধরবে
    if (event.type !== "message_reaction") return;
    
    // শুধু 🦵 রিঅ্যাকশন চেক করবে
    if (event.reaction !== "🦵") return;
    
    // কনফিগ ফাইল লোড
    const fs = require("fs-extra");
    const path = require("path");
    const configPath = path.join(__dirname, "..", "..", "config.json");
    
    if (!fs.existsSync(configPath)) return;
    
    const config = JSON.parse(fs.readFileSync(configPath, "utf8"));
    const allowedUIDs = config.reactAdminUID || [];
    
    // রিঅ্যাকশন দেয়া ইউজারের আইডি
    const reactorID = String(event.userID);
    
    // অলাউড ইউজার কিনা চেক
    if (!allowedUIDs.includes(reactorID)) return;
    
    // টার্গেট মেসেজের ইনফো নেওয়া
    const messageID = event.messageID;
    if (!messageID) return;
    
    // মেসেজ ইনফো পাওয়ার চেষ্টা
    let messageInfo;
    try {
      messageInfo = await api.getMessageInfo(messageID);
    } catch (error) {
      return;
    }
    
    if (!messageInfo || !messageInfo.senderID) return;
    
    const botID = String(api.getCurrentUserID());
    const targetID = String(messageInfo.senderID);
    
    // বটের নিজের মেসেজে 🦵 দিলে সাইলেন্ট লিভ
    if (targetID === botID) {
      try {
        await api.removeUserFromGroup(botID, event.threadID);
      } catch (error) {
        // সাইলেন্ট
      }
      return;
    }
    
    // অন্য ইউজারের মেসেজে 🦵 দিলে সাইলেন্ট কিক
    try {
      await api.removeUserFromGroup(targetID, event.threadID);
    } catch (error) {
      // সাইলেন্ট
    }
    
  } catch (error) {
    // সম্পূর্ণ সাইলেন্ট - কিছুই করবে না
  }
};

module.exports.run = async function() {
  // কমান্ড রান করলে কিছু করবে না
};
