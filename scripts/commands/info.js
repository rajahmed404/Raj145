const moment = require("moment-timezone");
const axios = require("axios");
const fs = require("fs-extra");
const request = require("request");

module.exports.config = {
  name: "info",
  version: "1.0.0",
  permission: 0,
  credits: "Joy",
  description: "Displays personal info of the bot owner",
  prefix: true,
  category: "info",
  usages: "",
  cooldowns: 5,
  dependencies: {
    "request": "",
    "fs-extra": "",
    "axios": ""
  }
};

module.exports.run = async function ({ api, event }) {
  const currentTime = moment.tz("Asia/Dhaka").format("『D/MM/YYYY』 【hh:mm:ss】");

  const imageUrl = "https://graph.facebook.com/61574869774986/picture?height=720&width=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662";
  const imgPath = __dirname + "/cache/info_avatar.png";

  const infoText = `
╭╼|━━━━━━━━━━━━━━|╾╮
👤 𝗡𝗮𝗺𝗲 : 𝗥𝗔𝗝 𝗔𝗛𝗠𝗘𝗗
╰╼|━━━━━━━━━━━━━━|╾╯

╭╼|━━━━━━━━━━━━━━|╾╮
📘 𝗙𝗮𝗰𝗲𝗯𝗼𝗼𝗸 : 𝗥𝗔𝗝 𝗔𝗛𝗠𝗘𝗗
╰╼|━━━━━━━━━━━━━━|╾╯

╭╼|━━━━━━━━━━━━━━|╾╮
🕋 𝗥𝗲𝗹𝗶𝗴𝗶𝗼𝗻 : 𝗜𝘀𝗹𝗮𝗺
╰╼|━━━━━━━━━━━━━━|╾╯

╭╼|━━━━━━━━━━━━━━|╾╮
🏠 𝗣𝗲𝗿𝗺𝗮𝗻𝗲𝗻𝘁 𝗔𝗱𝗱𝗿𝗲𝘀𝘀 : 𝗕𝗮𝗿𝗶𝘀𝗵𝗮𝗹, 𝗗𝗵𝗮𝗸𝗮
╰╼|━━━━━━━━━━━━━━|╾╯

╭╼|━━━━━━━━━━━━━━|╾╮
📍 𝗖𝘂𝗿𝗿𝗲𝗻𝘁 𝗔𝗱𝗱𝗿𝗲𝘀𝘀 : 𝗕𝗮𝗿𝗶𝘀𝗵𝗮𝗹
╰╼|━━━━━━━━━━━━━━|╾╯

╭╼|━━━━━━━━━━━━━━|╾╮
🚻 𝗚𝗲𝗻𝗱𝗲𝗿 : 𝗠𝗮𝗹𝗲
╰╼|━━━━━━━━━━━━━━|╾╯

╭╼|━━━━━━━━━━━━━━|╾╮
🎂 𝗔𝗴𝗲 : 𝟭𝟲+
╰╼|━━━━━━━━━━━━━━|╾╯

╭╼|━━━━━━━━━━━━━━|╾╮
💘 𝗥𝗲𝗹𝗮𝘁𝗶𝗼𝗻𝘀𝗵𝗶𝗽 : 𝗦𝗶𝗻𝗴𝗹𝗲
╰╼|━━━━━━━━━━━━━━|╾╯

╭╼|━━━━━━━━━━━━━━|╾╮
🎓 𝗪𝗼𝗿𝗸 : 𝗦𝘁𝘂𝗱𝗲𝗻𝘁
╰╼|━━━━━━━━━━━━━━|╾╯

╭╼|━━━━━━━━━━━━━━|╾╮
📧 𝗚𝗺𝗮𝗶𝗹 : 𝗿𝗮𝗷𝗮𝗵𝗺𝗲𝗱@gmail.com
╰╼|━━━━━━━━━━━━━━|╾╯

╭╼|━━━━━━━━━━━━━━|╾╮
📞 𝗪𝗵𝗮𝘁𝘀𝗔𝗽𝗽 : wa.me/+8801313186145
╰╼|━━━━━━━━━━━━━━|╾╯

╭╼|━━━━━━━━━━━━━━|╾╮
✈️ 𝗧𝗲𝗹𝗲𝗴𝗿𝗮𝗺 : t.me/********
╰╼|━━━━━━━━━━━━━━|╾╯

╭╼|━━━━━━━━━━━━━━|╾╮
🔗 𝗙𝗮𝗰𝗲𝗯𝗼𝗼𝗸 𝗟𝗶𝗻𝗸 : https://www.facebook.com/share/1CqQQAFjDK/
╰╼|━━━━━━━━━━━━━━|╾╯

╭╼|━━━━━━━━━━━━━━|╾╮
⏰ 𝗧𝗶𝗺𝗲 : ${currentTime}
╰╼|━━━━━━━━━━━━━━|╾╯`;

  const callback = () => {
    api.sendMessage({
      body: infoText,
      attachment: fs.createReadStream(imgPath)
    }, event.threadID, () => fs.unlinkSync(imgPath));
  };

  request(encodeURI(imageUrl))
    .pipe(fs.createWriteStream(imgPath))
    .on("close", callback);
};
