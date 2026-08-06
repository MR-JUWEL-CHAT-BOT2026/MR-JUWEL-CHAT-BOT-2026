const fs = require("fs");
const path = require("path");
const guardSpam = require("../Rahat_spt.js");

module.exports = function ({ api, models, Users, Threads, Currencies }) {
  const stringSimilarity = require('string-similarity'),
    escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
    logger = require("../../utils/log.js");
  const axios = require('axios')
  const moment = require("moment-timezone");
  const vipFilePath = path.join(__dirname, "../../Script/commands/cache/vip.json");
  const vipModePath = path.join(__dirname, "../../Script/commands/cache/vipMode.json");
  const loadVIP = () => {
    if (!fs.existsSync(vipFilePath)) return [];
    const data = fs.readFileSync(vipFilePath, "utf-8");
    return JSON.parse(data);
  }
  const loadVIPMode = () => {
    if (!fs.existsSync(vipModePath)) return false;
    const data = fs.readFileSync(vipModePath, "utf-8");
    const parsed = JSON.parse(data);
    return parsed.vipMode || false;
  }
  return async function ({ event }) {
    const dateNow = Date.now()
    const time = moment.tz("Asia/Dhaka").format("HH:MM:ss DD/MM/YYYY");
    const { allowInbox, PREFIX, ADMINBOT, NDH, DeveloperMode, adminOnly, keyAdminOnly, ndhOnly,adminPaOnly } = global.config;
    const { userBanned, threadBanned, threadInfo, threadData, commandBanned } = global.data;
    const { commands, cooldowns } = global.client;
    var { body, senderID, threadID, messageID } = event;
    var senderID = String(senderID),
      threadID = String(threadID);
    const distributorAdmins = (global.client.distributorAdmins || []).map(String);
    const isDistributorAdmin = distributorAdmins.includes(senderID);
    const isInboxMessage = senderID == threadID;
    if (isInboxMessage && (!allowInbox || !ADMINBOT.includes(senderID))) return;
    const threadSetting = threadData.get(threadID) || {}
    const configuredPrefix = (threadSetting.hasOwnProperty("PREFIX")) ? threadSetting.PREFIX : PREFIX;
    const prefixRegex = new RegExp(`^(<@!?${senderID}>|${escapeRegex(configuredPrefix)})\\s*`);
    const isBotAdmin = ADMINBOT.includes(senderID) || isDistributorAdmin;
    if (!prefixRegex.test(body)) {
      if (!isBotAdmin) return;
    }
    const adminbot = require('./../../config.json');
//// admin -pa /////
    if(!global.data.allThreadID.includes(threadID) && !ADMINBOT.includes(senderID) && !isDistributorAdmin && adminbot.adminPaOnly == true)
    return api.sendMessage("> 🎀\n» 𝐎𝐧𝐥𝐲 𝐚𝐝𝐦𝐢𝐧𝐬 𝐜𝐚𝐧 𝐮𝐬𝐞 𝐛𝐨𝐭𝐬 𝐢𝐧 𝐭𝐡𝐞𝐢𝐫 𝐨𝐰𝐧 𝐢𝐧𝐛𝐨𝐱", threadID, messageID)
    ////end 
    if (!ADMINBOT.includes(senderID) && !isDistributorAdmin && adminbot.adminOnly == true) {
      if (!ADMINBOT.includes(senderID) && !isDistributorAdmin && adminbot.adminOnly == true) return api.sendMessage('> 🎀\n𝐔𝐟𝐟𝐬, 𝐎𝐧𝐥𝐲 𝐀𝐝𝐦𝐢𝐧𝐬 𝐜𝐚𝐧 𝐮𝐬𝐞 𝐭𝐡𝐞 𝐛𝐨𝐭', threadID, messageID)
    }
    if (!NDH.includes(senderID) && !ADMINBOT.includes(senderID) && !isDistributorAdmin && adminbot.ndhOnly == true) {
      if (!NDH.includes(senderID) && !ADMINBOT.includes(senderID) && !isDistributorAdmin && adminbot.ndhOnly == true) return api.sendMessage('MODE » Only bot support can use bots', threadID, messageID)
    }
    const dataAdbox = require('../../Script/commands/cache/data.json');
    var threadInf = (threadInfo.get(threadID) || await Threads.getInfo(threadID));
    const findd = threadInf.adminIDs.find(el => el.id == senderID);
    if (dataAdbox.adminbox.hasOwnProperty(threadID) && dataAdbox.adminbox[threadID] == true && !ADMINBOT.includes(senderID) && !isDistributorAdmin && !findd && event.isGroup == true) return api.sendMessage('MODE » Only admins can use bots', event.threadID, event.messageID)
    if (userBanned.has(senderID) || threadBanned.has(threadID)) {
      if (!ADMINBOT.includes(senderID.toString()) && !isDistributorAdmin) {
        if (userBanned.has(senderID)) {
          const { reason, dateAdded } = userBanned.get(senderID) || {};
          return api.sendMessage(global.getText("handleCommand", "userBanned", reason, dateAdded), threadID, async (err, info) => {
            await new Promise(resolve => setTimeout(resolve, 5 * 1000));
            return api.unsendMessage(info.messageID);
          }, messageID);
        } else {
          if (threadBanned.has(threadID)) {
            const { reason, dateAdded } = threadBanned.get(threadID) || {};
            return api.sendMessage(global.getText("handleCommand", "threadBanned", reason, dateAdded), threadID, async (err, info) => {
              await new Promise(resolve => setTimeout(resolve, 5 * 1000));
              return api.unsendMessage(info.messageID);
            }, messageID);
          }
        }
      }
    }
    const prefixMatch = body.match(prefixRegex);
    const matchedPrefixLength = prefixMatch ? prefixMatch[0].length : 0;
    const usedNoPrefix = isBotAdmin && matchedPrefixLength === 0;
    const args = body.slice(matchedPrefixLength).trim().split(/ +/);
    commandName = args.shift().toLowerCase();
    if (!usedNoPrefix) {
      const spamBanned = await guardSpam({
        api,
        Users,
        senderID,
        threadID,
        messageID,
        triggerKey: commandName || "__prefix_only__",
      });
      if (spamBanned) return;
    }
   var command = commands.get(commandName);
    if (!command) {
      if (usedNoPrefix) return;
      var allCommandName = [];
      const commandValues = commands['keys']();
      for (const cmd of commandValues) allCommandName.push(cmd)
      const checker = stringSimilarity.findBestMatch(commandName, allCommandName);
      if (checker.bestMatch.rating >= 0.5) command = client.commands.get(checker.bestMatch.target);
      else return api.sendMessage(global.getText("handleCommand", "commandNotExist", checker.bestMatch.target), threadID);
    }
    if (commandBanned.get(threadID) || commandBanned.get(senderID)) {
      if (!ADMINBOT.includes(senderID) && !isDistributorAdmin) {
        const banThreads = commandBanned.get(threadID) || [],
          banUsers = commandBanned.get(senderID) || [];
        if (banThreads.includes(command.config.name))
          return api.sendMessage(global.getText("handleCommand", "commandThreadBanned", command.config.name), threadID, async (err, info) => {
            await new Promise(resolve => setTimeout(resolve, 5 * 1000))
            return api.unsendMessage(info.messageID);
          }, messageID);
        if (banUsers.includes(command.config.name))
          return api.sendMessage(global.getText("handleCommand", "commandUserBanned", command.config.name), threadID, async (err, info) => {
            await new Promise(resolve => setTimeout(resolve, 5 * 1000));
            return api.unsendMessage(info.messageID);
          }, messageID);
      }
    }
    if (command.config.commandCategory.toLowerCase() == 'nsfw' && !global.data.threadAllowNSFW.includes(threadID) && !ADMINBOT.includes(senderID) && !isDistributorAdmin)
      return api.sendMessage(global.getText("handleCommand", "threadNotAllowNSFW"), threadID, async (err, info) => {

        await new Promise(resolve => setTimeout(resolve, 5 * 1000))
        return api.unsendMessage(info.messageID);
      }, messageID);
    var threadInfo2;
    if (event.isGroup == !![])
      try {
        threadInfo2 = (threadInfo.get(threadID) || await Threads.getInfo(threadID))
        if (Object.keys(threadInfo2).length == 0) throw new Error();
      } catch (err) {
        logger(global.getText("handleCommand", "cantGetInfoThread", "error"));
      }
    var permssion = 0;
    var threadInfoo = (threadInfo.get(threadID) || await Threads.getInfo(threadID));
    const find = threadInfoo.adminIDs.find(el => el.id == senderID);
    if (NDH.includes(senderID.toString())) permssion = 2;
    if (ADMINBOT.includes(senderID.toString())) permssion = 3;
    else if (!ADMINBOT.includes(senderID) && !NDH.includes(senderID) && find) permssion = 1;
    if (isDistributorAdmin) permssion = 3;
const vipList = loadVIP();
const vipMode = loadVIPMode();
if (!ADMINBOT.includes(senderID) && !isDistributorAdmin) {
  if(vipMode && !vipList.includes(senderID)) {
      return api.sendMessage("> ❌\n𝐎𝐧𝐥𝐲 𝐕𝐈𝐏 𝐮𝐬𝐞𝐫 𝐜𝐚𝐧 𝐮𝐬𝐞 𝐜𝐨𝐦𝐦𝐚𝐧𝐝", threadID, messageID);
  }
}
if (command.config.hasPermssion > permssion) return api.sendMessage(global.getText("handleCommand", "permssionNotEnough", command.config.name), event.threadID, event.messageID);
     
    if (!client.cooldowns.has(command.config.name)) client.cooldowns.set(command.config.name, new Map());
    const timestamps = client.cooldowns.get(command.config.name);;
    const expirationTime = (command.config.cooldowns || 1) * 1000;
    if (timestamps.has(senderID) && dateNow < timestamps.get(senderID) + expirationTime) 
      return api.sendMessage(`You just used this command and\ntry again later ${((timestamps.get(senderID) + expirationTime - dateNow)/1000).toFixed(1)} seconds. Please wait before using it again.`, threadID, messageID);

    var getText2;
    if (command.languages && typeof command.languages == 'object' && command.languages.hasOwnProperty(global.config.language))
      getText2 = (...values) => {
        var lang = command.languages[global.config.language][values[0]] || '';
        for (var i = values.length; i > 0; i--) {
          const expReg = RegExp('%' + i, 'g');
          lang = lang.replace(expReg, values[i]);
        }
        return lang;
      };
    else getText2 = () => { };

    try {
      const Obj = {};
      Obj.api = api;
      Obj.event = event;
      Obj.args = args;
      Obj.models = models;
      Obj.Users = Users;
      Obj.Threads = Threads;
      Obj.Currencies = Currencies;
      Obj.permssion = permssion;
      Obj.getText = getText2;
      command.run(Obj);
      timestamps.set(senderID, dateNow);
      if (DeveloperMode === true)
        logger(
          global.getText(
            "handleCommand",
            "executeCommand",
            time,
            commandName,
            senderID,
            threadID,
            args.join(" "),
            Date.now() - dateNow
          ),
          "[ DEV MODE ]"
        );

      return;
    } catch (e) {
      return api.sendMessage(
        global.getText("handleCommand", "commandError", commandName, e),
        threadID,
        messageID
      );
    }
  };
};
