module.exports.config = {
  name: "ban",
  version: "2.4.0",
  hasPermssion: 2,
  credits: "SHAHADAT SAHU",
  description: "Ban or unban a user directly, works on reply too",
  commandCategory: "group",
  usages: `${global.config.PREFIX}ban <UID/@tag>\n${global.config.PREFIX}unban <UID/@tag>`,
  cooldowns: 5
};

module.exports.languages = {
  "en": {
    "banSuccess": "[ Ban User ] Banned user: %1",
    "unbanSuccess": "[ Unban User ] Unbanned user: %1",
    "errorReponse": "%1 Can't do what you request",
    "IDNotFound": "%1 ID you import doesn't exist in database",
    "notBanned": "[ Unban User ] User %1 is not banned.",
  }
}

module.exports.run = async ({ event, api, args, Users, getText }) => {
  const { threadID, messageID, messageReply } = event;

  if (!args[0] && !messageReply) 
    return api.sendMessage("Usage: ban <UID/@tag> or unban <UID/@tag>, or reply to a user's message", threadID, messageID);

  const command = event.body.split(" ")[0].slice(global.config.PREFIX.length).toLowerCase(); // ban or unban
  let targetID;
  if (messageReply) {
    targetID = messageReply.senderID;
  }
  else if (Object.keys(event.mentions).length > 0) {
    targetID = Object.keys(event.mentions)[0];
  } 
  else {
    targetID = args[0];
  }

  if (!targetID) return api.sendMessage("Please mention, reply, or give UID!", threadID, messageID);
  if (isNaN(targetID)) return api.sendMessage("Invalid UID!", threadID, messageID);
  if (!global.data.allUserID.includes(targetID)) 
    return api.sendMessage(getText("IDNotFound", "[ User System ]"), threadID, messageID);

  const nameTarget = global.data.userName.get(targetID) || await Users.getNameUser(targetID);

  if (command === "ban") {
    try {
      let data = (await Users.getData(targetID)).data || {};
      data.banned = true;
      await Users.setData(targetID, { data });
      global.data.userBanned.set(targetID, { reason: null, dateAdded: new Date().toLocaleString("en-GB", { timeZone: "Asia/Dhaka" }) });
      return api.sendMessage(getText("banSuccess", `${targetID} - ${nameTarget}`), threadID, messageID);
    } catch {
      return api.sendMessage(getText("errorReponse", "[ Ban User ]"), threadID);
    }
  }

  else if (command === "unban") {
    try {
      let data = (await Users.getData(targetID)).data || {};
      if (!data.banned) return api.sendMessage(getText("notBanned", `${targetID} - ${nameTarget}`), threadID);

      data.banned = false;
      await Users.setData(targetID, { data });
      global.data.userBanned.delete(targetID);

      return api.sendMessage(getText("unbanSuccess", `${targetID} - ${nameTarget}`), threadID, messageID);
    } catch {
      return api.sendMessage(getText("errorReponse", "[ Unban User ]"), threadID);
    }
  }

  else {
    return api.sendMessage("Wrong input! Use ban/unban <UID/@tag> or reply to a user's message", threadID, messageID);
  }
};
