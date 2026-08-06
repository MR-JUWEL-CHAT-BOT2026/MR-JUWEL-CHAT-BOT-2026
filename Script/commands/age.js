module.exports = {
  config: {
    name: "age",
    version: "4.0",
    author: "乛 M𝆠፝֟R ཐི༏ཋྀ JU𝆠፝֟W𝆠፝֟ELꜛཐི༏ཋྀ࿐",
    hasPermission: 0,
    commandCategory: "utility",
    cooldowns: 5,
    description: "Ultimate Premium Age Calculator",
    usage: "age DD/MM/YYYY"
  },

  run: async function ({ api, event, args }) {

    const moment = require("moment-timezone");

    try {

      // HELP MENU
      if (!args[0]) {
        return api.sendMessage(
`╭━━━━━━━━━━━━━━━━━━╮
┃ 🎂 PREMIUM AGE SYSTEM
╰━━━━━━━━━━━━━━━━━━╯

📌 ব্যবহার:
➤ age DD/MM/YYYY

📌 উদাহরণ:
➤ age 16/12/2006

✨ FEATURES
✔ Exact Age
✔ Birthday Countdown
✔ Birthday Day
✔ Life Progress Bar
✔ Fun Death Clock
✔ Heartbeat Counter
✔ Sleep Counter
✔ Breath Counter
✔ Premium UI

╭━━━━━━━━━━━━━━━━━━╮
┃ ⚡ Powered By MR JUWEL
╰━━━━━━━━━━━━━━━━━━╯`,
          event.threadID,
          event.messageID
        );
      }

      const input = args[0];

      // FORMAT CHECK
      if (!/^\d{2}\/\d{2}\/\d{4}$/.test(input)) {
        return api.sendMessage(
          "❌ সঠিক ফরম্যাট দিন:\n➤ age DD/MM/YYYY",
          event.threadID,
          event.messageID
        );
      }

      const [day, month, year] = input.split("/").map(Number);

      const now = moment.tz("Asia/Dhaka");

      const originalBirth = moment.tz(
        `${year}-${month}-${day}`,
        "YYYY-MM-DD",
        "Asia/Dhaka"
      );

      // INVALID DATE
      if (!originalBirth.isValid()) {
        return api.sendMessage(
          "❌ ভুল জন্ম তারিখ দেওয়া হয়েছে",
          event.threadID,
          event.messageID
        );
      }

      // FUTURE DATE
      if (originalBirth.isAfter(now)) {
        return api.sendMessage(
          "❌ ভবিষ্যতের তারিখ দেওয়া যাবে না",
          event.threadID,
          event.messageID
        );
      }

      // EXACT AGE
      let birth = originalBirth.clone();

      const years = now.diff(birth, "years");
      birth.add(years, "years");

      const months = now.diff(birth, "months");
      birth.add(months, "months");

      const days = now.diff(birth, "days");

      // TOTAL TIME
      const totalDays = now.diff(originalBirth, "days");
      const totalHours = now.diff(originalBirth, "hours");
      const totalMinutes = now.diff(originalBirth, "minutes");
      const totalSeconds = now.diff(originalBirth, "seconds");

      // HEARTBEAT
      const heartbeat = totalMinutes * 80;

      // BREATH
      const breaths = totalMinutes * 16;

      // SLEEP
      const sleepYears = (years / 3).toFixed(1);

      // LIFE PROGRESS
      const avgLife = 75;
      const progress = Math.min(
        100,
        ((years / avgLife) * 100).toFixed(1)
      );

      const filled = Math.floor(progress / 10);
      const empty = 10 - filled;

      const progressBar =
        "█".repeat(filled) + "░".repeat(empty);

      // FUN DEATH CLOCK
      const remainingLife = Math.max(
        0,
        (avgLife - years).toFixed(1)
      );

      // BIRTHDAY DAY
      const birthDayName = originalBirth.format("dddd");

      // NEXT BIRTHDAY
      let nextBirthday = moment.tz(
        `${now.year()}-${month}-${day}`,
        "YYYY-MM-DD",
        "Asia/Dhaka"
      );

      if (nextBirthday.isBefore(now)) {
        nextBirthday.add(1, "year");
      }

      const nextBirthdayDay = nextBirthday.format("dddd");

      const remainDays = nextBirthday.diff(now, "days");
      const remainHours =
        nextBirthday.diff(now, "hours") % 24;

      const remainMinutes =
        nextBirthday.diff(now, "minutes") % 60;

      // BIRTHDAY REMINDER
      let reminder = "❌ আজ জন্মদিন না";

      if (remainDays === 0) {
        reminder = "🎉 আজ আপনার জন্মদিন!";
      } else if (remainDays === 1) {
        reminder = "⏰ আগামীকাল আপনার জন্মদিন!";
      }

      // MESSAGE
      const msg =
`╔══════════════════════╗
      🎂 AGE REPORT
╚══════════════════════╝

👤 জন্ম তারিখ
➤ ${input}

📅 জন্ম বার
➤ ${birthDayName}

🧓 বর্তমান বয়স
➤ ${years} বছর
➤ ${months} মাস
➤ ${days} দিন

📊 মোট সময়
➤ ${totalDays.toLocaleString()} দিন
➤ ${totalHours.toLocaleString()} ঘন্টা
➤ ${totalMinutes.toLocaleString()} মিনিট
➤ ${totalSeconds.toLocaleString()} সেকেন্ড

❤️ Heartbeat Counter
➤ ${heartbeat.toLocaleString()}+

🌬 মোট শ্বাস নেওয়া
➤ ${breaths.toLocaleString()}+

😴 মোট ঘুম হিসাব
➤ প্রায় ${sleepYears} বছর

📈 Life Progress
➤ ${progress}%

${progressBar}

☠ Fun Death Clock
➤ বাকি প্রায় ${remainingLife} বছর

🎉 Next Birthday
➤ ${nextBirthdayDay}

⏳ ${remainDays} দিন
⏳ ${remainHours} ঘন্টা
⏳ ${remainMinutes} মিনিট বাকি

🔔 Birthday Reminder
➤ ${reminder}

╔══════════════════════╗
     ✨ PREMIUM SYSTEM
╚══════════════════════╝`;

      return api.sendMessage(
        msg,
        event.threadID,
        event.messageID
      );

    } catch (e) {

      console.log(e);

      return api.sendMessage(
        "❌ Command Error",
        event.threadID,
        event.messageID
      );
    }
  }
};
