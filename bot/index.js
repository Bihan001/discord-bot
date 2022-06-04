const Discord = require('discord.js');
const { playAudio, pauseAudio, resumeAudio, stopAudio } = require('./player');
const { DISCORD_BOT_TOKEN, BOT_PREFIX } = require('../utilities');

const intents = Object.keys(Discord.Intents.FLAGS);
const client = new Discord.Client({ restTimeOffset: 0, intents, partials: ['MESSAGE', 'CHANNEL', 'REACTION'] });

const initializeBot = async () => {
  client.on('ready', () => {
    console.log(`${client.user.username} ready!`);
    client.user.setActivity('in the path of life', { type: 'Lost' });
  });

  client.on('messageCreate', (msg) => {
    if (msg.author.bot) return;
    const [prefix, command, data, ...rest] = msg.content.split(' ').map((x) => x.trim());
    if (prefix !== BOT_PREFIX) return;
    try {
      if (command === 'poke') {
        return msg.channel.send('konoo');
      }
      if (command === 'pause') {
        return pauseAudio();
      }
      if (command === 'resume') {
        return resumeAudio();
      }
      if (command === 'stop') {
        return stopAudio();
      }
      if (command === 'play') {
        playAudio(data, msg);
      }
    } catch (err) {
      return msg.reply(err.message);
    }
  });

  client.on('warn', console.info);
  client.on('error', console.error);

  client
    .login(DISCORD_BOT_TOKEN)
    .then((res) => console.log(res))
    .catch((err) => console.log(err));
};

module.exports = { initializeBot };
