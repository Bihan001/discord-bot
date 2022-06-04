const { joinVoiceChannel, createAudioPlayer, createAudioResource } = require('@discordjs/voice');
const ytdl = require('ytdl-core');

const player = createAudioPlayer();

const playAudio = (url, msg) => {
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
      connection.destroy();
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
