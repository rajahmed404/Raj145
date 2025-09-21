const axios = require("axios");
const fs = require("fs");
const { createWriteStream } = require("fs");
const path = require("path");
const cheerio = require("cheerio");

module.exports.config = {
  name: "xx",
  version: "1.5",
  Permssion: 0,
  credits: "Joy", // শুধুমাত্র metadata
  description: "Search & send XNXX videos",
  category: "media",
  usages: "[query]",
  cooldowns: 5,
  prefix: true
};

const BOT_HEADER = "╭╼━━━╾╮\n RAJ-BOT\n╰╼━━━╾╯\n\n";

module.exports.run = async function ({ api, event, args }) {
  if (!args.length) return api.sendMessage(BOT_HEADER + "❌ Please provide a search query.", event.threadID, event.messageID);

  const query = args.join(" ");
  try {
    const searchUrl = `https://www.xnxx.com/search/${encodeURIComponent(query)}`;
    const response = await axios.get(searchUrl);
    const $ = cheerio.load(response.data);

    let videos = [];
    $(".thumb-block").each((i, el) => {
      if (i >= 5) return;
      const title = $(el).find(".thumb-under > p > a").text().trim();
      const link = "https://www.xnxx.com" + $(el).find("a").attr("href");
      videos.push({ title, link });
    });

    if (!videos.length) return api.sendMessage(BOT_HEADER + "❌ No videos found.", event.threadID, event.messageID);

    let msg = BOT_HEADER + "🔞 XNXX Search Results:\n\n";
    videos.forEach((v, i) => {
      msg += `${i + 1}. ${v.title}\n${v.link}\n\n`;
    });

    api.sendMessage(
      { body: msg + "Reply with a number to download." },
      event.threadID,
      (err, info) => {
        global.client.handleReply.push({
          name: this.config.name,
          messageID: info.messageID, // ভিডিও লিস্ট message
          author: event.senderID,
          videos
        });
      },
      event.messageID
    );

  } catch (e) {
    console.error(e);
    api.sendMessage(BOT_HEADER + "❌ Failed to search videos.", event.threadID, event.messageID);
  }
};

module.exports.handleReply = async function ({ api, event, handleReply }) {
  if (event.senderID !== handleReply.author) return;

  const index = parseInt(event.body);
  if (isNaN(index) || index < 1 || index > handleReply.videos.length)
    return api.sendMessage(BOT_HEADER + "❌ Invalid choice.", event.threadID, event.messageID);

  const video = handleReply.videos[index - 1];

  try {
    const pageRes = await axios.get(video.link);
    const page = pageRes.data;
    const highMatch = page.match(/html5player\.setVideoUrlHigh\('([^']+)'\)/);
    const video_high = highMatch ? highMatch[1] : null;

    if (!video_high) {
      api.sendMessage(BOT_HEADER + "❌ Could not fetch video link.", event.threadID, event.messageID);
      return;
    }

    const videoPath = path.resolve(__dirname, `video_${Date.now()}.mp4`);
    const writer = createWriteStream(videoPath);
    const videoResStream = await axios({
      url: video_high,
      method: "GET",
      responseType: "stream"
    });

    videoResStream.data.pipe(writer);

    writer.on("finish", async () => {
      // ভিডিও reply হিসেবে পাঠানো
      await api.sendMessage(
        { body: BOT_HEADER + `✅ ${video.title}`, attachment: fs.createReadStream(videoPath) },
        event.threadID,
        async () => {
          fs.unlinkSync(videoPath);
          // শুধু ভিডিও লিস্ট message unsend
          await api.unsendMessage(handleReply.messageID);
        }
      );
    });

    writer.on("error", () => {
      api.sendMessage(BOT_HEADER + "❌ Failed to download video.", event.threadID, event.messageID);
    });

  } catch (e) {
    console.error(e);
    api.sendMessage(BOT_HEADER + "❌ Failed to download video.", event.threadID, event.messageID);
  }
};
