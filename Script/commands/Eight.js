const fs = require("fs");
module.exports.config = {
	name: "night",
    version: "1.0.1",
	hasPermssion: 0,
	credits: "🔰Rahat🔰", 
	description: "hihihihi",
	commandCategory: "no prefix",
	usages: "night",
    cooldowns: 5, 
};

module.exports.handleEvent = function({ api, event, client, __GLOBAL }) {
	var { threadID, messageID } = event;
	if (event.body.indexOf("Good night")==0 || event.body.indexOf("good night")==0 || event.body.indexOf("Gud night")==0 || event.body.indexOf("Gud nini")==0) {
		var msg = {
				body: "যা ভাগ এখান থেকে😒",
				attachment: fs.createReadStream(__dirname + `/cache/night.gif`)
			}
			api.sendMessage(msg, threadID, messageID);
    api.setMessageReaction("🔰", event.messageID, (err) => {}, true)
		}
	}
	module.exports.run = function({ api, event, client, __GLOBAL }) {

  }
