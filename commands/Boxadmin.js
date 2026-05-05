module.exports.config = {
  name: "boxadmin",
  version: "1.0.0",
  hasPermssion: 2,
  credits: "🔰𝐑𝐀𝐇𝐀𝐓 𝐈𝐒𝐋𝐀𝐌🔰",
  description: "Add/remove admin via me, mention, or reply",
  commandCategory: "system",
  usages: "boxadmin me | boxadmin add/remove [@mention/reply/UID/link/name]",
  cooldowns: 5
};

const cleanName = (name) => {
  if (!name) return null;
  return name.replace(/\s+/g, " ").trim();
};

// ===== Helper: Full Name Mention Detection =====
async function getUIDByFullName(api, threadID, body) {
  if (!body.includes("@")) return null;
  const match = body.match(/@(.+)/);
  if (!match) return null;
  const targetName = match[1].trim().toLowerCase().replace(/\s+/g, " ");
  const threadInfo = await api.getThreadInfo(threadID);
  const users = threadInfo.userInfo || [];
  const user = users.find(u => {
    if (!u.name) return false;
    const fullName = u.name.trim().toLowerCase().replace(/\s+/g, " ");
    return fullName === targetName;
  });
  return user ? user.id : null;
}

// ===== Helper: Get Target User =====
async function getTargetUser(api, event, args) {
  let uid;
  
  // Special case: "me" keyword
  if (args[0]?.toLowerCase() === "me") {
    return { uid: event.senderID, action: "add" };
  }
  
  // Check if action is specified
  const action = args[0]?.toLowerCase();
  if (!action || !["add", "remove"].includes(action)) {
    return { uid: null, action: null };
  }
  
  const targetArg = args.slice(1).join(" ");
  
  // ===== Determine targetID in three ways =====
  if (event.type === "message_reply") {
    // Way 1: Reply to a message
    uid = event.messageReply.senderID;
  } else if (targetArg) {
    if (targetArg.indexOf(".com/") !== -1) {
      // Way 2: Facebook profile link
      uid = await api.getUID(targetArg);
    } else if (targetArg.includes("@")) {
      // Way 3: Mention or full name
      // 3a: Direct Facebook mention
      uid = Object.keys(event.mentions || {})[0];
      if (!uid) {
        // 3b: Full name detection
        uid = await getUIDByFullName(api, event.threadID, targetArg);
      }
    } else {
      // Direct UID
      uid = targetArg;
    }
  }
  
  return { uid, action };
}

module.exports.run = async function({ api, event, args }) {
  const threadID = event.threadID;
  const botID = api.getCurrentUserID();

  try {
    // Get target user and action using three-way detection
    const { uid, action } = await getTargetUser(api, event, args);
    
    // Handle "me" keyword
    if (args[0]?.toLowerCase() === "me") {
      const meUid = event.senderID;
      const meAction = "add";
      
      const userInfo = await api.getUserInfo([meUid]);
      const senderName = cleanName(userInfo[meUid]?.name) || "আপনি";
      
      const threadInfo = await api.getThreadInfo(threadID);
      const botIsAdmin = threadInfo.adminIDs.some(admin => admin.id == botID);
      const targetIsAdmin = threadInfo.adminIDs.some(admin => admin.id == meUid);
      
      if (!botIsAdmin) 
        return api.sendMessage("এই কমান্ডটি Usage  করার জন্য আগে আমাকে গ্রুপের এডমিন দিতে হবে 🌺", threadID, event.messageID);
      
      if (targetIsAdmin) 
        return api.sendMessage(`${senderName} আগে থেকেই গ্রুপের এডমিন রয়েছেন ✅`, threadID, event.messageID);
      
      await api.changeAdminStatus(threadID, meUid, true);
      return api.sendMessage(`✅ ${senderName} নিজেকে এডমিন বানিয়েছে! 🌸`, threadID, event.messageID);
    }
    
    // Check if valid action and uid
    if (!action || !["add", "remove"].includes(action)) {
      return api.sendMessage("🌸 Usage:\n• boxadmin me\n• boxadmin add [@mention/reply/UID/link/name]\n• boxadmin remove [@mention/reply/UID/link/name]", threadID, event.messageID);
    }
    
    if (!uid) {
      return api.sendMessage("❌রাহাদ বসকে ডাক দে🫩\nকীভাবে কমান্ড ব্যবহার করতে হয় শিখায় দিবো🥴", threadID, event.messageID);
    }
    
    // Get user info
    const userInfo = await api.getUserInfo([uid, event.senderID]);
    
    const senderName = cleanName(userInfo[event.senderID]?.name) || "আপনি";
    const targetName = cleanName(userInfo[uid]?.name) || "User";
    
    // Get thread info
    const threadInfo = await api.getThreadInfo(threadID);
    const botIsAdmin = threadInfo.adminIDs.some(admin => admin.id == botID);
    const targetIsAdmin = threadInfo.adminIDs.some(admin => admin.id == uid);
    
    // Check bot permissions
    if (!botIsAdmin) 
      return api.sendMessage("🔰এই কমান্ডটি Usage  করার জন্য আগে আমাকে গ্রুপের এডমিন দিতে হবে", threadID, event.messageID);
    
    // Perform action
    if (action === "add") {
      if (targetIsAdmin) 
        return api.sendMessage(`${targetName} আগে থেকেই গ্রুপের এডমিন রয়েছেন ✅`, threadID, event.messageID);
      
      await api.changeAdminStatus(threadID, uid, true);
      if (uid === event.senderID) 
        return api.sendMessage(`✅ ${senderName} নিজেকে এডমিন বানিয়েছে! 🌸`, threadID, event.messageID);
      else 
        return api.sendMessage(`✅ ${senderName} ${targetName}-কে এডমিন বানিয়েছে! 😘`, threadID, event.messageID);
      
    } else if (action === "remove") {
      if (!targetIsAdmin) 
        return api.sendMessage(`${targetName} এখনো গ্রুপের এডমিন নয়! ❌`, threadID, event.messageID);
      
      await api.changeAdminStatus(threadID, uid, false);
      if (uid === event.senderID) 
        return api.sendMessage(` ${senderName} নিজেকে এডমিন থেকে রিমুভ করেছে! 🐸`, threadID, event.messageID);
      else 
        return api.sendMessage(` ${targetName} কে এডমিন থেকে রিমুভ করেছে! 🤣`, threadID, event.messageID);
    }
    
  } catch (e) {
    console.error(e);
    return api.sendMessage("⚠️ Error: " + e.message, threadID, event.messageID);
  }
};
