const fs = require('fs');
const path = require('path');
const yts = require('yt-search');
const ytdl = require('@distube/ytdl-core');

module.exports.config = {
  name: "music",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "Jonell Magallanes",
  description: "Get music",
  category: "media",
  prefix: true,
  usages: "[music name]",
  cooldowns: 10
};

module.exports.run = async function ({ api, event, args }) {
  const { threadID, messageID } = event;

  if (!args[0]) {
    return api.sendMessage(`❌ Please enter a music name!`, threadID);
  }

  try {
    const song = args.join(" ");
    const findingMessage = await api.sendMessage(`🔍 | Finding "${song}". Please wait...`, threadID);

    const searchResults = await yts(song);
    const firstResult = searchResults.videos[0];

    if (!firstResult) {
      return api.editMessage(`❌ | No results found for "${song}".`, findingMessage.messageID, threadID);
    }

    const { title, url } = firstResult;
    await api.editMessage(`⏱️ | Music title found: "${title}". Downloading...`, findingMessage.messageID, threadID);

    const filePath = path.resolve(__dirname, 'cache', `${Date.now()}.mp3`);
    const videoInfo = await ytdl.getBasicInfo(url);

    if (videoInfo.videoDetails.lengthSeconds > 600) {
      return api.editMessage(`❌ | The video duration exceeds 10 minutes. Unable to download "${title}".`, findingMessage.messageID, threadID);
    }

    const fileStream = fs.createWriteStream(filePath);
    ytdl(url, { filter: 'audioonly' }).pipe(fileStream);

    fileStream.on('finish', async () => {
      const stats = fs.statSync(filePath);
      const fileSizeInMB = stats.size / (1024 * 1024);

      if (fileSizeInMB > 25) {
        fs.unlinkSync(filePath);
        return api.editMessage(`❌ | The file size exceeds the 25MB limit. Unable to send "${title}".`, findingMessage.messageID, threadID);
      }

      await api.sendMessage(
        {
          body: `🎵 Here is your music based on your search "${song}"\n\nTitle: ${title}\nYouTube Link: ${url}`,
          attachment: fs.createReadStream(filePath)
        },
        threadID
      );

      fs.unlinkSync(filePath);
      api.unsendMessage(findingMessage.messageID);
    });

    fileStream.on('error', async (error) => {
      fs.unlinkSync(filePath);
      await api.editMessage(`❌ | Error while saving the file: ${error.message}`, findingMessage.messageID, threadID);
    });
  } catch (error) {
    await api.sendMessage(`❌ | An error occurred: ${error.message}`, threadID, messageID);
  }
};
