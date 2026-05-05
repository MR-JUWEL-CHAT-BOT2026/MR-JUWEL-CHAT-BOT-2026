module.exports.config = {
  name: "playlyrics",
  version: "2.0.4",
  hasPermssion: 0,
  credits: "MrTomXxX",
  description: "Play music with lyrics",
  commandCategory: "utility",
  usages: "[title]",
  cooldowns: 5,
  dependencies: {
            "fs-extra": "",
            "request": "",
            "axios": "",
            "youtubei.js": ""
  }
};

module.exports.run = async({api, event}) => {
	const axios = require("axios");
    const fs = require("fs-extra");
    const Innertube = require("youtubei.js");
    const request = require("request");
    let input = event.body;
    let vips = ["100017985245260","100017985245260"];
 
    var text = input;     text = text.substring(12)
let data = input.split(" ");
  
if (data.length < 2) {               return api.sendMessage("⚠️Invalid Use Of Command!\n💡Usage: "+global.config.prefix+"playLyrics<space>title of music", event.threadID);
}
  

data.shift()

const res = await axios.get(`https://api-saikidesu-beta.herokuapp.com/api/utility/lyrics?title=${text}&apikey=freelang`);
let saiki = Object.values(res.data.result);
//console.log(saiki)
           
  const youtube = await new Innertube();
 
  const search = await youtube.search(text);
if (search.videos[0] === undefined){
api.sendMessage("Error: Invalid request.",event.threadID,event.messageID)
api.setMessageReaction("❎", event.messageID, (err) => {}, true)
}else{
api.sendMessage(`🔎Searching for "${text}"...`,  event.threadID,event.messageID);
api.setMessageReaction("✅", event.messageID, (err) => {}, true)
var timeleft = 3;
var downloadTimer = setInterval(function(){
  if(timeleft <= 0){
    clearInterval(downloadTimer);
  //  api.sendMessage("A video has found!\n\nStarting to Download", event.threadID, event.messageID);
    }
  timeleft -= 1;
}, 1000);
  const stream = youtube.download(search.videos[0].id, {
    format: 'mp4',
    type: 'audio',
    audioQuality: 'lowest',
    loudnessDB: '20',
    audioBitrate: '320',
    fps: '30'
  });
  
  
stream.pipe(fs.createWriteStream(__dirname + `/cache/${event.senderID}.m4a`))

  stream.on('start', () => {
    console.info('[DOWNLOADER]', 'Starting download now!');
  }); 
  stream.on('info', (info) => {
    console.info('[DOWNLOADER]',`Downloading ${info.video_details.title} by ${info.video_details.metadata.channel_name}`);
    console.log(info)
  });
  stream.on('end', () => {
  // process.stdout.clearLine();
  // process.stdout.cursorTo(0);
    console.info(`[DOWNLOADER] Downloaded`)
    
if (fs.statSync(__dirname + `/cache/${event.senderID}.m4a`).size > 26214400) return api.sendMessage('[ERR] The file could not be sent because it is larger than 25MB.', event.threadID, () => fs.unlinkSync(__dirname + `/cache/${event.senderID}.m4a`), event.messageID);

    var message = {
          body:("Here's your music, enjoy!🥰\n\nTitle: "+search.videos[0].title+"\nArtist: "+ saiki[1] +"\n\nLyrics: "+ saiki[3] +"\n\nLink: " + saiki[2]),
         attachment:[ 
fs.createReadStream(__dirname + `/cache/${event.senderID}.m4a`)]}
           api.sendMessage(message, event.threadID,event.messageID);
  }); 
stream.on('error', (err)=> console.error('[ERROR]',err))

  stream.on('end', async () => {                                             if (fs.existsSync(__dirname + `/cache/${event.senderID}.m4a`)) {
                                    fs.unlink(__dirname + `/cache/${event.senderID}.m4a`, function (err) {
                                  if (err) console.log(err);                                        
                                  console.log(__dirname + `/cache/${event.senderID}.m4a is deleted!`);
                                                        });
                                                     }
             })
 
}
      } 
                                     
