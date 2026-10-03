const { createCanvas } = require('canvas');
const os = require('os');
const fs = require('fs-extra');
const path = require('path');
const { execSync } = require('child_process');

module.exports.config = {
  name: "upt",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "MR JUWEL",
  description: "System real-time monitoring with image (No Prefix)",
  commandCategory: "system",
  usages: "",
  cooldowns: 5
};

// cache folder
module.exports.onLoad = () => {
  const cache = __dirname + "/cache/";
  if (!fs.existsSync(cache)) fs.mkdirSync(cache, { recursive: true });
};

// helper (bytes to size)
const f = b => {
  const s = ['B','KB','MB','GB','TB'];
  const i = Math.floor(Math.log(b) / Math.log(1024));
  return (b / Math.pow(1024, i)).toFixed(2) + ' ' + s[i];
};

// CPU usage
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

// Disk usage
const getDisk = () => {
  try {
    const d = execSync('df -k /').toString().split('\n')[1].split(/\s+/);
    const used = parseInt(d[2]) * 1024;
    const total = parseInt(d[1]) * 1024;
    return Math.min(100, Math.round((used / total) * 100));
  } catch {
    return 80;
  }
};

// rounded rect
const rr = (c,x,y,w,h,r) => {
  c.beginPath();
  c.moveTo(x+r,y);
  c.arcTo(x+w,y,x+w,y+h,r);
  c.arcTo(x+w,y+h,x,y+h,r);
  c.arcTo(x,y+h,x,y,r);
  c.arcTo(x,y,x+w,y,r);
  c.closePath();
};

// ================= NOPREFIX HANDLER =================
module.exports.handleEvent = async function ({ api, event }) {
  if (!event.body) return;
  const msg = event.body.toLowerCase().trim();
  if (msg === "upt") {
    return module.exports.run({ api, event });
  }
};

// ================= MAIN RUN =================
module.exports.run = async function ({ api, event }) {
  try {
    const start = Date.now();

    const cpu = getCPU();
    const totalRam = os.totalmem();
    const usedRam = totalRam - os.freemem();
    const ram = Math.min(100, Math.round((usedRam / totalRam) * 100));
    const disk = getDisk();

    const sec = process.uptime();
    const d = Math.floor(sec / 86400);
    const h = Math.floor(sec % 86400 / 3600);
    const m = Math.floor(sec % 3600 / 60);
    const s = Math.floor(sec % 60);
    const uptime = d ? `${d}d ${h}h ${m}m ${s}s` : `${h}h ${m}m ${s}s`;

    const ping = Date.now() - start;

    // canvas
    const cv = createCanvas(1080, 720);
    const c = cv.getContext('2d');

    c.fillStyle = '#0b0b22';
    c.fillRect(0, 0, 1080, 720);

    c.fillStyle = 'rgba(15,15,40,0.95)';
    c.strokeStyle = '#3399ff';
    c.lineWidth = 6;
    rr(c, 30, 30, 1020, 660, 60);
    c.fill();
    c.stroke();

    c.font = 'bold 80px Arial';
    c.fillStyle = '#fff';
    c.textAlign = 'center';
    c.fillText('SYSTEM STATUS', 540, 145);

    c.font = '36px Arial';
    c.fillStyle = '#60a5fa';
    c.fillText('Real-time Server Monitoring', 540, 195);

    const ring = (x, y, p, col, label) => {
      const r = 118, t = 26;

      c.beginPath();
      c.arc(x, y, r, 0, Math.PI * 2);
      c.fillStyle = 'rgba(255,255,255,0.08)';
      c.fill();

      c.beginPath();
      c.arc(x, y, r, -Math.PI/2, (p/100) * Math.PI*2 - Math.PI/2);
      c.lineWidth = t;
      c.strokeStyle = col;
      c.lineCap = 'round';
      c.stroke();

      c.font = 'bold 62px Arial';
      c.fillStyle = '#fff';
      c.textAlign = 'center';
      c.textBaseline = 'middle';
      c.fillText(p + '%', x, y);

      c.font = '30px Arial';
      c.fillStyle = '#ccc';
      c.fillText(label, x, y + 85);
    };

    ring(240, 355, cpu, '#00ff88', 'CPU');
    ring(540, 355, ram, '#ff3366', 'RAM');
    ring(840, 355, disk, '#3399ff', 'DISK');

    const g = (txt, y, col='#00ffcc') => {
      c.font = 'bold 38px Arial';
      c.fillStyle = col;
      c.textAlign = 'left';
      c.fillText(txt, 100, y);
    };

    g(`Uptime  →  ${uptime}`, 520);
    g(`RAM     →  ${ram}%   •   Disk  →  ${disk}%`, 570);
    g(`Memory  →  ${f(usedRam)} / ${f(totalRam)}`, 620);

    const pc = ping < 80 ? '#00ff88' : ping < 150 ? '#ffaa00' : '#ff3366';
    g(`Ping    →  ${ping}ms`, 670, pc);

    const file = path.join(__dirname, 'cache', 'upt.png');
    fs.writeFileSync(file, cv.toBuffer('image/png'));

    api.sendMessage(
      { attachment: fs.createReadStream(file) },
      event.threadID,
      () => fs.unlinkSync(file),
      event.messageID
    );

  } catch (e) {
    api.sendMessage("❌ UPT image generate error", event.threadID, event.messageID);
  }
};
