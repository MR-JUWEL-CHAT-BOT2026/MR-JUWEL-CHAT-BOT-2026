const { createCanvas, loadImage } = require('canvas');
const os = require('os');
const fs = require('fs-extra');
const path = require('path');
const { execSync } = require('child_process');
const axios = require('axios');

module.exports.config = {
  name: "upt",
  version: "3.0.0",
  hasPermssion: 0,
  credits: "乛 M𝆠፝֟R ཐི༏ཋྀ JU𝆠፝֟W𝆠፝֟ELꜛཐི༏ཋྀ࿐",
  description: "Ultra System Monitor Dashboard",
  commandCategory: "system",
  usages: "",
  cooldowns: 5
};

module.exports.onLoad = () => {
  const cache = path.join(__dirname, "cache");
  if (!fs.existsSync(cache)) fs.mkdirSync(cache, { recursive: true });
};

/* ---------- CPU ---------- */
let prev = null;
const getCPU = () => {
  let idle = 0, total = 0;
  for (const c of os.cpus()) {
    for (const t in c.times) total += c.times[t];
    idle += c.times.idle;
  }
  const cur = { idle, total };
  if (!prev) { prev = cur; return 0; }
  const di = cur.idle - prev.idle;
  const dt = cur.total - prev.total;
  prev = cur;
  return dt ? Math.round(100 - (100 * di / dt)) : 0;
};

/* ---------- Disk ---------- */
const getDiskInfo = () => {
  try {
    const out = execSync('df -h').toString().split('\n').slice(1, 4);
    return out.map(l => {
      const p = l.split(/\s+/);
      return { mount: p[5], used: p[2], total: p[1], percent: p[4] };
    });
  } catch {
    return [];
  }
};

/* ---------- Ping ---------- */
const getPing = () => {
  try {
    const res = execSync('ping -c 1 8.8.8.8').toString();
    const match = res.match(/time=(\d+\.?\d*)/);
    return match ? Math.round(Number(match[1])) : 0;
  } catch {
    return 0;
  }
};

/* ---------- Process ---------- */
const getTopProcess = () => {
  try {
    const res = execSync('ps -eo pid,comm,%cpu,%mem --sort=-%cpu | head -6')
      .toString()
      .split('\n')
      .slice(1, 6);
    return res.map(l => l.trim()).filter(Boolean);
  } catch {
    return [];
  }
};

/* ---------- Health ---------- */
const healthScore = (cpu, ram, disk, ping) => {
  let score = 100;
  score -= cpu * 0.4;
  score -= ram * 0.3;
  score -= disk * 0.2;
  score -= ping * 0.1;
  return Math.max(0, Math.round(score));
};

module.exports.handleEvent = async ({ api, event }) => {
  if (!event.body) return;
  const msg = event.body.trim().toLowerCase();
  if (msg === "up" || msg === "upt") {
    return module.exports.run({ api, event });
  }
};

module.exports.run = async ({ api, event }) => {
  try {
    const senderID = event.senderID;
    
    // ইউজারের প্রোফাইল ফটো ডাউনলোড
    let avatarURL = `https://graph.facebook.com/${senderID}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;
    let avatarImg = null;
    try {
      const response = await axios.get(avatarURL, { responseType: 'arraybuffer' });
      avatarImg = await loadImage(Buffer.from(response.data));
    } catch (e) {
      avatarImg = null;
    }

    getCPU();
    await new Promise(r => setTimeout(r, 400));
    const cpu = getCPU();

    const totalRam = os.totalmem();
    const usedRam = totalRam - os.freemem();
    const ram = Math.round((usedRam / totalRam) * 100);

    const diskRaw = getDiskInfo();
    const disk = diskRaw.length ? parseInt(diskRaw[0].percent) : 0;

    const ping = getPing();
    const health = healthScore(cpu, ram, disk, ping);

    const uptimeSec = process.uptime();
    const uptime = `${Math.floor(uptimeSec/3600)}h ${Math.floor(uptimeSec%3600/60)}m ${Math.floor(uptimeSec%60)}s`;

    const processes = getTopProcess();

    // বড়ো ক্যানভাস
    const canvas = createCanvas(1800, 1200);
    const c = canvas.getContext('2d');

    /* =======================================================
       🎨 ড্যাশবোর্ড - সবুজ ব্যাকগ্রাউন্ড
    ======================================================= */

    /* ---------- পুরো সবুজ ব্যাকগ্রাউন্ড ---------- */
    const bgGrad = c.createRadialGradient(900, 600, 100, 900, 600, 1000);
    bgGrad.addColorStop(0, '#00ff00');
    bgGrad.addColorStop(0.5, '#008000');
    bgGrad.addColorStop(1, '#004d00');
    c.fillStyle = bgGrad;
    c.fillRect(0, 0, 1800, 1200);

    /* ---------- আউটার ফ্রেম (ডাবল বর্ডার - সোনালী+সাদা) ---------- */
    // প্রথম বর্ডার - সোনালী (বড়)
    c.shadowColor = '#ffd700';
    c.shadowBlur = 60;
    c.strokeStyle = '#ffd700';
    c.lineWidth = 12;
    c.beginPath();
    c.roundRect(25, 25, 1750, 1150, 55);
    c.stroke();
    
    // দ্বিতীয় বর্ডার - সাদা (ছোট)
    c.shadowColor = '#ffffff';
    c.shadowBlur = 30;
    c.strokeStyle = '#ffffff';
    c.lineWidth = 6;
    c.beginPath();
    c.roundRect(45, 45, 1710, 1110, 45);
    c.stroke();
    
    // তৃতীয় বর্ডার - সোনালী (ডটেড)
    c.shadowBlur = 0;
    c.setLineDash([15, 15]);
    c.strokeStyle = '#ffd700';
    c.lineWidth = 4;
    c.beginPath();
    c.roundRect(65, 65, 1670, 1070, 40);
    c.stroke();
    c.setLineDash([]);

    /* ---------- মেইন প্যানেল (সবুজ) ---------- */
    c.shadowBlur = 0;
    c.fillStyle = 'rgba(0, 100, 0, 0.85)';
    c.beginPath();
    c.roundRect(85, 85, 1630, 1030, 35);
    c.fill();

    /* ---------- প্রোফাইল ফটো (বড়ো সাইজ) ---------- */
    const photoSize = 280;
    if (avatarImg) {
      c.save();
      c.beginPath();
      c.arc(900, 200, photoSize/2, 0, Math.PI * 2);
      c.closePath();
      c.clip();
      c.drawImage(avatarImg, 900 - photoSize/2, 200 - photoSize/2, photoSize, photoSize);
      c.restore();
      
      // ফটোর চারপাশে ডাবল রিং
      c.shadowColor = '#ffd700';
      c.shadowBlur = 40;
      c.strokeStyle = '#ffd700';
      c.lineWidth = 10;
      c.beginPath();
      c.arc(900, 200, photoSize/2 + 10, 0, Math.PI * 2);
      c.stroke();
      
      c.shadowColor = '#ffffff';
      c.shadowBlur = 20;
      c.strokeStyle = '#ffffff';
      c.lineWidth = 5;
      c.beginPath();
      c.arc(900, 200, photoSize/2 + 20, 0, Math.PI * 2);
      c.stroke();
      c.shadowBlur = 0;
    } else {
      c.beginPath();
      c.arc(900, 200, 130, 0, Math.PI * 2);
      c.fillStyle = '#ffd700';
      c.fill();
      c.fillStyle = '#008000';
      c.font = 'bold 70px Arial';
      c.textAlign = 'center';
      c.fillText("UPT",900,225);
    }

    /* ---------- টাইটেল (সাদা) ---------- */
    c.shadowColor = '#ffffff';
    c.shadowBlur = 30;
    c.fillStyle = '#ffffff';
    c.font = 'bold 85px "Arial"';
    c.textAlign = 'center';
    c.fillText("⚡ ULTRA DASHBOARD ⚡",900,400);
    c.shadowBlur = 0;

    /* ---------- বাম দিকের লেখা (সাদা) - বড়ো ---------- */
    c.font = 'bold 50px "Arial"';
    c.textAlign = 'left';
    c.fillStyle = '#ffffff';
    
    // ✅ হেডার
    c.fillText("✅ SYSTEM METRICS",120,480);

    // 🟢 CPU - সাদা
    c.fillStyle = '#ffffff';
    c.font = 'bold 48px "Arial"';
    c.fillText(`🟢 CPU: ${cpu}%`,120,555);
    
    // 🟥 RAM - সাদা
    c.fillStyle = '#ffffff';
    c.fillText(`🟥 RAM: ${ram}%`,120,630);
    
    // 🟨 DISK - সাদা
    c.fillStyle = '#ffffff';
    c.fillText(`🟨 DISK: ${disk}%`,120,705);
    
    // 🤍 HEALTH - সাদা
    c.fillStyle = '#ffffff';
    c.fillText(`🤍 HEALTH: ${health}%`,120,780);

    // ⏱ Uptime - সাদা
    c.fillStyle = '#ffffff';
    c.font = 'bold 46px "Arial"';
    c.fillText(`⏱ Uptime: ${uptime}`,120,865);
    
    // 📶 Ping - সাদা
    c.fillStyle = '#ffffff';
    c.fillText(`📶 Ping: ${ping} ms`,120,940);

    // 💾 DISK PARTITIONS - সাদা
    c.fillStyle = '#ffffff';
    c.font = 'bold 48px "Arial"';
    c.fillText("💾 DISK PARTITIONS:",120,1015);

    let y = 1015;
    diskRaw.slice(0,3).forEach((d, index) => {
      y += 55;
      c.fillStyle = '#ffffff';
      c.font = 'bold 42px "Arial"';
      c.fillText(`${d.mount}  ➜  ${d.used} / ${d.total}  (${d.percent})`,160,1060 + (index * 55));
    });

    /* ---------- ডান দিকের লেখা (সাদা) - বড়ো ---------- */
    let y2 = 480;
    c.fillStyle = '#ffffff';
    c.font = 'bold 50px "Arial"';
    c.textAlign = 'left';
    c.fillText("⚙️ TOP PROCESSES:",1050,530);

    processes.forEach((p, index) => {
      y2 += 65;
      c.fillStyle = '#ffffff';
      c.font = 'bold 42px "Arial"';
      c.fillText(p,1080,555 + (index * 65));
    });

    // 🖥 OS - সাদা
    c.fillStyle = '#ffffff';
    c.font = 'bold 44px "Arial"';
    c.fillText(`🖥 OS: ${os.platform()}`,1050,865);
    
    // 🧠 CPU Cores - সাদা
    c.fillStyle = '#ffffff';
    c.fillText(`🧠 CPU Cores: ${os.cpus().length}`,1050,940);
    
    // 📦 Node - সাদা
    c.fillStyle = '#ffffff';
    c.fillText(`📦 Node: ${process.version}`,1050,1015);

    /* ---------- ফ্রেমের কর্নার ডেকোরেশন (সোনালী+সাদা) ---------- */
    const corners = [
      [85,85], [1715,85], [85,1115], [1715,1115]
    ];
    
    corners.forEach(([x,y]) => {
      // বড় সোনালী বৃত্ত
      c.shadowColor = '#ffd700';
      c.shadowBlur = 30;
      c.fillStyle = '#ffd700';
      c.beginPath();
      c.arc(x, y, 30, 0, Math.PI * 2);
      c.fill();
      
      // মাঝের সাদা বৃত্ত
      c.shadowColor = '#ffffff';
      c.shadowBlur = 20;
      c.fillStyle = '#ffffff';
      c.beginPath();
      c.arc(x, y, 18, 0, Math.PI * 2);
      c.fill();
      
      // ভিতরের সবুজ বৃত্ত
      c.shadowBlur = 0;
      c.fillStyle = '#008000';
      c.beginPath();
      c.arc(x, y, 8, 0, Math.PI * 2);
      c.fill();
      
      // ছোট সোনালী ডট
      c.fillStyle = '#ffd700';
      c.beginPath();
      c.arc(x, y, 3, 0, Math.PI * 2);
      c.fill();
    });
    c.shadowBlur = 0;

    /* ---------- সাইড ডেকোরেশন (সোনালী লাইন) ---------- */
    // বাম পাশের ডেকোরেটিভ লাইন
    for (let i = 0; i < 4; i++) {
      const yPos = 480 + (i * 145);
      c.shadowColor = '#ffd700';
      c.shadowBlur = 15;
      c.fillStyle = '#ffd700';
      c.beginPath();
      c.roundRect(90, yPos, 8, 55, 10);
      c.fill();
    }
    
    // ডান পাশের ডেকোরেটিভ লাইন
    for (let i = 0; i < 4; i++) {
      const yPos = 480 + (i * 145);
      c.shadowColor = '#ffd700';
      c.shadowBlur = 15;
      c.fillStyle = '#ffd700';
      c.beginPath();
      c.roundRect(1700, yPos, 8, 55, 10);
      c.fill();
    }
    c.shadowBlur = 0;

    /* ---------- ফাইল সেভ ---------- */
    const file = path.join(__dirname,'cache','upt.png');
    fs.writeFileSync(file, canvas.toBuffer());

    return api.sendMessage(
      { attachment: fs.createReadStream(file) },
      event.threadID,
      () => fs.unlinkSync(file),
      event.messageID
    );

  } catch (e) {
    console.error(e);
    return api.sendMessage("❌ Dashboard error", event.threadID, event.messageID);
  }
};
