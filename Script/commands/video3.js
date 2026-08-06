/** I am doing this coding with a lot of difficulty, please don't post it yourself¯\_(ツ)_/¯ **/
module.exports.config = {
 name: "video3",
 version: "1.0.0",
 hasPermssion: 0,
 credits: "MR JUWEL",
 description: "sVEDIO",
 commandCategory: "Hình ảnh",
 usages: "video3",
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

 "https://drive.google.com/uc?id=1SJwyugnDdPg5S6Rsp_AGN0k89M8kphc-",
 "https://drive.google.com/uc?id=1SkhEpeTyws-642io1eSdtQNcjKcQW-YI",
 "https://drive.google.com/uc?id=1Sl2tlQsCXWt0ftfgoPRzbbCOgeZumBCb",
 "https://drive.google.com/uc?id=1SWjSricVE9om1YIgYHxe6rIB7jsniVYO",
 "https://drive.google.com/uc?id=1S5BJF6EP8P5sHxGV6ZZQD9MGS0mLPHId",
 "https://drive.google.com/uc?id=1RotdZFn6GM1mgN_J7-e-owE5PxZvPXDS",
 "https://drive.google.com/uc?id=1SaEMUvRg3MxeDv8sM0qpVSmzV_wlTolK",
 "https://drive.google.com/uc?id=1SWQWgcSfy12lRtc-Q0da7KMLrfYTLyBS",
 "https://drive.google.com/uc?id=1SfmyXKoZ88VmNgLGa4voGWJ-7AVFUuRv",
 "https://drive.google.com/uc?id=1RtNXhFEpO2PItJ0D4vt9ZI_kx-8hFvds",
 "https://drive.google.com/uc?id=1SFifqTR8h8ihvD9n1K3x8SYsX0tPS3vK",
 "https://drive.google.com/uc?id=1SZvneFa5km4IF2djocrNt1jE9ioobZth",
 "https://drive.google.com/uc?id=1ShI3tdH8DFu_rB9uhDrfCCYbvm1gZqqE",
 "https://drive.google.com/uc?id=1S7RLmTw321iDt6m_NdP4KjWYPbALrkXT",
 "https://drive.google.com/uc?id=1S1nr6cQkYNvd36u61Jg2ND2xbqj1Uyww",
 "https://drive.google.com/uc?id=1S5m4j-T_sQo7EaOhkF2FGcY8Vin2Gkj8",
 "https://drive.google.com/uc?id=1S42Xq1rBUX1gaXb18hkjEyOCTLk62cHc",
 "https://drive.google.com/uc?id=1ShtQRmVNElLrdGEMjVIVYhMJCGuPLnWn",
 "https://drive.google.com/uc?id=1Slw7RWMMNlL80EqtTgoxxC6ZvswQE5YK",
 "https://drive.google.com/uc?id=1SpJVnzc6WY0OwOQw7J4h8RnUG6teHs1c",
 "https://drive.google.com/uc?id=1SZ8BJ2f_1R0iqJqRfQ9b301XsxBSum4R",
 "https://drive.google.com/uc?id=1SAuiAI8WXKAhqaTAoeF_W40SwrKjJvkU",

"https://drive.google.com/uc?id=1S5Y8Ir-URLU6XlxH8ZxSj4QIiY0NXPAD",

"https://drive.google.com/uc?id=1Sb1WDoZAwSEX7_uQlKKXFSI2yDi0DX58",
];
 var callback = () => api.sendMessage({body:`「 ${know} 」`,attachment: fs.createReadStream(__dirname + "/cache/15.mp4")}, event.threadID, () => fs.unlinkSync(__dirname + "/cache/15.mp4")); 
 return request(encodeURI(link[Math.floor(Math.random() * link.length)])).pipe(fs.createWriteStream(__dirname+"/cache/15.mp4")).on("close",() => callback());
 };
