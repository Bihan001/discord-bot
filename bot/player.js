const { joinVoiceChannel, createAudioPlayer, createAudioResource } = require('@discordjs/voice');
const ytdl = require('ytdl-core');
const youtubeSearch = require('youtube-search-without-api-key');

const player = createAudioPlayer();

const playAudio = async (msg, data) => {
  const expression = /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi;
  const regex = new RegExp(expression);
  let url = data; // assume the data is a url
  if (!data.match(regex)) {
    const videos = await youtubeSearch.search(url); // if the data is not url, search it on youtube and get the first result
    if (videos.length === 0) throw new Error('No video found');
    url = videos[0].snippet.url;
  }
  const voiceInstance = msg.member.voice;
  if (!voiceInstance.channelId) throw new Error('Join a voice channel first konooo');
  const connection = joinVoiceChannel({
    channelId: voiceInstance.channel.id,
    guildId: msg.guild.id,
    adapterCreator: msg.guild.voiceAdapterCreator,
  });
  const stream = ytdl(url, { filter: 'audioonly' });
  const resource = createAudioResource(stream);
  player.play(resource);
  connection.subscribe(player);
  player.addListener('stateChange', (oldOne, newOne) => {
    if (newOne.status == 'idle') {
      if (connection.state !== 'destroyed') connection.destroy();
    }
  });
};

const pauseAudio = () => {
  player.pause();
};

const resumeAudio = () => {
  player.unpause();
};

const stopAudio = () => {
  player.stop();
};

module.exports = { playAudio, pauseAudio, resumeAudio, stopAudio };
