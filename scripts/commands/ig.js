module.exports.config = {
  name: ".",
  version: "1.0.0",
  permission: 0,
  credits: "Joy Ahmed",
  description: "৪০+ ইসলামিক ক্যাপশন ও ছবি সহ ক্যাপশন কমান্ড",
  prefix: "true",
  category: "caption",
  usages: "islamiccaptions",
  cooldowns: 5,
};

module.exports.run = async function({ api, event }) {
  const axios = require("axios");
  const fs = require("fs-extra");
  const path = require("path");

  const captions = [
`╭╼|━━━━━━━━━━━━━━|╾╮
│ আল্লাহর রহমতে জীবন সফল হবে 🌙✨
│ সবসময় ইমানকে শক্ত রাখো 📿🕋
│
│ 𝐂𝐫𝐞𝐚𝐭𝐨𝐫: 𝐑𝐚𝐣 𝐀𝐡𝐦𝐞𝐝
╰╼|━━━━━━━━━━━━━━|╾╯`,

`╭╼|━━━━━━━━━━━━━━|╾╮
│ নামাজের মাধ্যমে শান্তি লাভ করি 🕌🙏
│ পৃথিবীর বালা থেকে মুক্তি চাই 🤲🌟
│
│ 𝐂𝐫𝐞𝐚𝐭𝐨𝐫: 𝐑𝐚𝐣 𝐀𝐡𝐦𝐞𝐝
╰╼|━━━━━━━━━━━━━━|╾╯`,

`╭╼|━━━━━━━━━━━━━━|╾╮
│ দোয়া করতে ভুলোনা, আল্লাহ সব শোনেন 🤲💫
│ ধৈর্য ধরে ভালো পথে চলা উচিত 🕊️📖
│
│ 𝐂𝐫𝐞𝐚𝐭𝐨𝐫: 𝐑𝐚𝐣 𝐀𝐡𝐦𝐞𝐝
╰╼|━━━━━━━━━━━━━━|╾╯`,

`╭╼|━━━━━━━━━━━━━━|╾╮
│ ধৈর্যই হলো সবচেয়ে বড় বৈশিষ্ট্য 🕊️✨
│ আল্লাহর ওপর ভরসা রাখো সবসময় 🙏🌟
│
│ 𝐂𝐫𝐞𝐚𝐭𝐨𝐫: 𝐑𝐚𝐣 𝐀𝐡𝐦𝐞𝐝
╰╼|━━━━━━━━━━━━━━|╾╯`,

`╭╼|━━━━━━━━━━━━━━|╾╮
│ সূরা আল ফাতিহা পড়ো নিয়মিত 📖🕌
│ এটি জীবনের পথপ্রদর্শক 🌙💫
│
│ 𝐂𝐫𝐞𝐚𝐭𝐨𝐫: 𝐑𝐚𝐣 𝐀𝐡𝐦𝐞𝐝
╰╼|━━━━━━━━━━━━━━|╾╯`,

`╭╼|━━━━━━━━━━━━━━|╾╮
│ ইসলামের আলো ছড়িয়ে দাও সর্বত্র 🕋💡
│ সত্য পথেই চলার প্রতিজ্ঞা করো 🤲🕊️
│
│ 𝐂𝐫𝐞𝐚𝐭𝐨𝐫: 𝐑𝐚𝐣 𝐀𝐡𝐦𝐞𝐝
╰╼|━━━━━━━━━━━━━━|╾╯`,

`╭╼|━━━━━━━━━━━━━━|╾╮
│ দুনিয়ার মোহ ভুলে, আখিরাতের জন্য কাজ করো ✨🕌
│ আল্লাহর রহমত অগাধ ❤️🌙
│
│ 𝐂𝐫𝐞𝐚𝐭𝐨𝐫: 𝐑𝐚𝐣 𝐀𝐡𝐦𝐞𝐝
╰╼|━━━━━━━━━━━━━━|╾╯`,

`╭╼|━━━━━━━━━━━━━━|╾╮
│ ভালো কাজের মাধ্যমে জান্নাতে যাওয়া যায় 🌟🕊️
│ আজকের চেষ্টা কালকের সাফল্য 🙏💫
│
│ 𝐂𝐫𝐞𝐚𝐭𝐨𝐫: 𝐑𝐚𝐣 𝐀𝐡𝐦𝐞𝐝
╰╼|━━━━━━━━━━━━━━|╾╯`,

`╭╼|━━━━━━━━━━━━━━|╾╮
│ আল্লাহর নাম জপো, মন শান্ত হবে 🤲🌸
│ সব কষ্ট দূর হবে ইনশাআল্লাহ 🕋❤️
│
│ 𝐂𝐫𝐞𝐚𝐭𝐨𝐫: 𝐑𝐚𝐣 𝐀𝐡𝐦𝐞𝐝
╰╼|━━━━━━━━━━━━━━|╾╯`,

`╭╼|━━━━━━━━━━━━━━|╾╮
│ কুরআন তেলাওয়াতই জীবনের আলো 📖✨
│ প্রতিদিন পড়ার অভ্যাস গড়ে তুলো 🕊️🌙
│
│ 𝐂𝐫𝐞𝐚𝐭𝐨𝐫: 𝐑𝐚𝐣 𝐀𝐡𝐦𝐞𝐝
╰╼|━━━━━━━━━━━━━━|╾╯`,



`╭╼|━━━━━━━━━━━━━━|╾╮
│ সত্য পথেই থাকো, আল্লাহ তোমার সাথে আছেন 🕊️✨
│ প্রার্থনা করো সবসময় 🙏❤️
│
│ 𝐂𝐫𝐞𝐚𝐭𝐨𝐫: 𝐑𝐚𝐣 𝐀𝐡𝐦𝐞𝐝
╰╼|━━━━━━━━━━━━━━|╾╯`,

`╭╼|━━━━━━━━━━━━━━|╾╮
│ আল্লাহর রহমতে জীবন সুন্দর হবে 🌙🕋
│ কখনো হতাশ হওয়া যাবে না 🤲✨
│
│ 𝐂𝐫𝐞𝐚𝐭𝐨𝐫: 𝐑𝐚𝐣 𝐀𝐡𝐦𝐞𝐝
╰╼|━━━━━━━━━━━━━━|╾╯`,

`╭╼|━━━━━━━━━━━━━━|╾╮
│ দোয়া ও নামাজ জীবনের মন্ত্র 📿🕌
│ সফলতা আসবে ইনশাআল্লাহ 🤲💫
│
│ 𝐂𝐫𝐞𝐚𝐭𝐨𝐫: 𝐑𝐚𝐣 𝐀𝐡𝐦𝐞𝐝
╰╼|━━━━━━━━━━━━━━|╾╯`,

`╭╼|━━━━━━━━━━━━━━|╾╮
│ আল্লাহর প্রেমে জীবন সুন্দর 🕊️❤️
│ তাঁর পথে চলো সবসময় 🌙✨
│
│ 𝐂𝐫𝐞𝐚𝐭𝐨𝐫: 𝐑𝐚𝐣 𝐀𝐡𝐦𝐞𝐝
╰╼|━━━━━━━━━━━━━━|╾╯`,

`╭╼|━━━━━━━━━━━━━━|╾╮
│ ধৈর্য আর বিশ্বাসই জীবনের চাবিকাঠি 🗝️🙏
│ আল্লাহর উপর ভরসা রাখো 🌟🤲
│
│ 𝐂𝐫𝐞𝐚𝐭𝐨𝐫: 𝐑𝐚𝐣 𝐀𝐡𝐦𝐞𝐝
╰╼|━━━━━━━━━━━━━━|╾╯`,

`╭╼|━━━━━━━━━━━━━━|╾╮
│ মানুষের সাথে মায়া করো, আল্লাহ সন্তুষ্ট থাকবেন 🕊️✨
│ দুনিয়ার মোহ ভুলে যাও 🌙❤️
│
│ 𝐂𝐫𝐞𝐚𝐭𝐨𝐫: 𝐑𝐚𝐣 𝐀𝐡𝐦𝐞𝐝
╰╼|━━━━━━━━━━━━━━|╾╯`,

`╭╼|━━━━━━━━━━━━━━|╾╮
│ জীবনে শান্তি চাও? নামাজ আদায় করো 🕌🙏
│ দোয়া করো সবসময় 🤲💫
│
│ 𝐂𝐫𝐞𝐚𝐭𝐨𝐫: 𝐑𝐚𝐣 𝐀𝐡𝐦𝐞𝐝
╰╼|━━━━━━━━━━━━━━|╾╯`,

`╭╼|━━━━━━━━━━━━━━|╾╮
│ আল্লাহর সাহায্য সর্বদাই তোমার সাথে 🌟✨
│ বিশ্বাস রাখো এবং এগিয়ে যাও 🕊️💫
│
│ 𝐂𝐫𝐞𝐚𝐭𝐨𝐫: 𝐑𝐚𝐣 𝐀𝐡𝐦𝐞𝐝
╰╼|━━━━━━━━━━━━━━|╾╯`,

`╭╼|━━━━━━━━━━━━━━|╾╮
│ সুন্দর জীবন শুরু হয় নামাজ দিয়ে 🕌🌙
│ দোয়া ও ভালো কাজের মাধ্যমে 🙏🤲
│
│ 𝐂𝐫𝐞𝐚𝐭𝐨𝐫: 𝐑𝐚𝐣 𝐀𝐡𝐦𝐞𝐝
╰╼|━━━━━━━━━━━━━━|╾╯`,

`╭╼|━━━━━━━━━━━━━━|╾╮
│ প্রতিদিন আল্লাহর স্মরণে থাকো 🕋💫
│ শান্তি ও সফলতা আসবে ইনশাআল্লাহ 🤲✨
│
│ 𝐂𝐫𝐞𝐚𝐭𝐨𝐫: 𝐑𝐚𝐣 𝐀𝐡𝐦𝐞𝐝
╰╼|━━━━━━━━━━━━━━|╾╯`
  ];

  
  const randomCaption = captions[Math.floor(Math.random() * captions.length)];

  
  const images = [
    "https://i.postimg.cc/ZR0SLZyy/received-104854222681538.jpg",
    "https://i.postimg.cc/CM3RdrW4/received-1077131053254543.jpg",
    "https://i.postimg.cc/mhWWRHpQ/received-1202913210365646.jpg",
    "https://i.postimg.cc/yxZCwPj1/received-179416495132916.jpg",
    "https://i.postimg.cc/8kJFpgn5/received-201956602842877.jpg",
    "https://i.postimg.cc/8c2N53cf/received-2183981171798286.jpg",
    "https://i.postimg.cc/6QWwyCWc/received-259795433354586.jpg",
    "https://i.postimg.cc/JzWRC9S9/received-317063074088232.jpg",
    "https://i.postimg.cc/5tsJvjjV/received-583147497311518.jpg",
    "https://i.postimg.cc/7ZMwHKkb/received-598373762409967.jpg",
    "https://i.postimg.cc/wTD7NczY/received-649778976784401.jpg",
    "https://i.postimg.cc/DZDKjDqp/received-659497149400143.jpg",
    "https://i.postimg.cc/WpC2XD8p/received-659559285696847.jpg",
    "https://i.postimg.cc/4NcXMJ26/received-819496329472643.jpg"
  ];

  
  const randomImage = images[Math.floor(Math.random() * images.length)];

  
  const pathFile = path.resolve(__dirname, "cache.jpg");

  const download = (url, dest) =>
    axios({
      url,
      method: "GET",
      responseType: "stream"
    }).then(
      response =>
        new Promise((resolve, reject) => {
          const stream = response.data.pipe(fs.createWriteStream(dest));
          stream.on("finish", () => resolve());
          stream.on("error", e => reject(e));
        })
    );

  try {
    await download(randomImage, pathFile);
    await api.sendMessage(
      {
        body: randomCaption,
        attachment: fs.createReadStream(pathFile),
      },
      event.threadID,
      () => fs.unlinkSync(pathFile),
      event.messageID
    );
  } catch (error) {
    console.log("Error sending message: ", error);
    api.sendMessage(randomCaption, event.threadID, event.messageID);
  }
};
