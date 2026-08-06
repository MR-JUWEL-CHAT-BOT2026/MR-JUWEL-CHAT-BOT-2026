/** I am doing this coding with a lot of difficulty, please don't post it yourself¯\_(ツ)_/¯ **/
module.exports.config = {
 name: "romantic",
 version: "1.0.0",
 hasPermssion: 0,
 credits: "MR JUWEL",
 description: "R VEDIO",
 commandCategory: " MR JUWEL",
 usages:romantic",
 cooldowns: 5,
 dependencies: {
 "request":"",
 "fs-extra":"",
 "axios":""
 }
};

module.exports.run = async({api,event,args,client,Users,Threads,__GLOBAL,Currencies}) => {
const axios = global.nodemodule["axios"];
const request = global.nodemodule["request"];
const fs = global.nodemodule["fs-extra"];
 var hi = ["--JUWEL-BOSS--"];
 var know = hi[Math.floor(Math.random() * hi.length)];
 var link = [

 "https://drive.google.com/uc?export=download&id=1nYpQbeYlrkdZk0mR7yVf0r_GCqbC1p48",
    "https://drive.google.com/uc?export=download&id=1T5lTbQ8h4nC4012gqC0VFfzr1Q7FYHrC",
    "https://drive.google.com/uc?export=download&id=1m8g9iQ0pRHRApmq2rFg1jJLhC65ko3cD",
    "https://drive.google.com/uc?export=download&id=1bJz3BMjb4lUvQ2vguGQnN8YHf8XgKfS7",
    "https://drive.google.com/uc?export=download&id=1K2f1mWofgQxuJpCrW4IFUu6pzl0P2cKE",
    "https://drive.google.com/uc?export=download&id=1lC8ZhLZcB3IX8j0NjY7V3w4Y5KBQDe6d"
    "https://drive.google.com/uc?export=download&id=1WR6Oa-7EE4vZl8iYclZEFnETpbOBBtSV",
    "https://drive.google.com/uc?export=download&id=1DCgIte4B79QeUCTyJjucrxoBujXoQnIn",
    "https://drive.google.com/uc?export=download&id=1pOcyU1xpVPnzJPMaRcA5NkN_oGAUU3Z2",
    "https://drive.google.com/uc?export=download&id=1D1GSdTKm1Z4NZkyGuhAMvxDsmKmTc6Ks",
    "https://drive.google.com/uc?export=download&id=1AnFT195JT02fhaJXBw7i1yfendTB-X7b",
    "https://drive.google.com/uc?export=download&id=17f9vAXYEoIb239C_Ptn9jM3R8kR53YaU",
    "https://drive.google.com/uc?export=download&id=1mP9xxTmXIzBbXhagAwSx5jOHJ047hozT",
    "https://drive.google.com/uc?export=download&id=1xSKsn9fZsNlhpsnUcVLXsaF91L3EvXf1",
    "https://drive.google.com/uc?export=download&id=1EIXeS4hpOCohGEPypwDf-Xk4RiDXnU0G",
    "https://drive.google.com/uc?export=download&id=1C0gHLG9wpggxJ0ZBLaLjKYBfkPjn1PBu",
    "https://drive.google.com/uc?export=download&id=13Jat-Kjv9TNdX4POOLPWZpMC-PZ_MlBr",
    "https://drive.google.com/uc?export=download&id=1rqU7qjJ4zGMiNe51sGhRAQAosHN4qMqW",
    "https://drive.google.com/uc?export=download&id=1jKUMfDk6aNffDTGm6Hc5k5uB80r5Ewby",
    "https://drive.google.com/uc?export=download&id=1ajLIJuzE_OWzkqytoWCSFcEvGy3S3ISs",
    "https://drive.google.com/uc?export=download&id=1jAERZHua3wFSVmiS_a3PxqlRaXxCPIsJ",
    "https://drive.google.com/uc?export=download&id=1XQAcvOVb6HUug1hGW-fjxKuEMe_gcOrB",
    "https://drive.google.com/uc?export=download&id=1r5urhhWExwHE5Aud86OQmcajfbEd1xw8",
    "https://drive.google.com/uc?export=download&id=1Tb78cllXQ76de-Nby8SqYX126zMqIuh6",
    "https://drive.google.com/uc?export=download&id=1QI4P5-UeYszwG_a2AFIljUevmyEndAeB",
    "https://drive.google.com/uc?export=download&id=1xwgf4a2UmJW7aPqLMVROIjDi90pOcliH",
    "https://drive.google.com/uc?export=download&id=1iQEuhXfjNZeU6Ztmuun0i6e0UGDL2_UI",
    "https://drive.google.com/uc?export=download&id=13bcsXymHqT_6Dz2O585X0NMUHLbS1TJ0",
    "https://drive.google.com/uc?export=download&id=1V_s7Fcj6Jjtn0GNGgl5x6FGpvmBvZwvw",
    "https://drive.google.com/uc?export=download&id=120NBq7y_gUvECo4RH8lkaNYw5-fZ7IAp",
    "https://drive.google.com/uc?export=download&id=16DB8Cixk9Sh80p68zwIzpCIBCVR-si_M",
    "https://drive.google.com/uc?export=download&id=1PD8ZRKb8oszSE_smKyfJ4oenNHn3Edx-",
    "https://drive.google.com/uc?export=download&id=1S_2tbOi-tVMCNJXQx9eJ4MUMSk2C1LGM",
    "https://drive.google.com/uc?export=download&id=1WtGtVoXY_3ldPSojKVCNTraHuCLUBI4-" 
  ];
 var callback = () => api.sendMessage({body:`「 ${know} 」`,attachment: fs.createReadStream(__dirname + "/cache/15.mp4")}, event.threadID, () => fs.unlinkSync(__dirname + "/cache/15.mp4")); 
 return request(encodeURI(link[Math.floor(Math.random() * link.length)])).pipe(fs.createWriteStream(__dirname+"/cache/15.mp4")).on("close",() => callback());
 };
