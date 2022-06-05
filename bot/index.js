const Discord = require('discord.js');
const { playAudio, pauseAudio, resumeAudio, stopAudio } = require('./player');
const { getRandomImage, audioPlay } = require('./misc-functions');
const { DISCORD_BOT_TOKEN, BOT_PREFIX } = require('../utilities');
const commands = require('./commands');
require('dotenv').config();

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
    const fullString = data + ' ' + rest.join(' ');
    try {
      switch (command) {
        case commands.play:
          playAudio(msg, fullString);
          break;
        case commands.pause:
          pauseAudio();
          break;
        case commands.resume:
          resumeAudio();
          break;
        case commands.stop:
          stopAudio();
          break;
        case commands.poke:
          msg.channel.send({ content: 'Konoo' });
          break;
        case commands.randomImage:
          getRandomImage(msg, data, rest[0]);
          break;
        case commands.audioPlay:
          audioPlay(msg, fullString);
          break;
      }
    } catch (err) {
      return msg.reply(err.message);
    }
  });

  client.on('warn', console.info);
  client.on('error', console.error);

  client
    .login(process.env.DISCORD_BOT_TOKEN)
    .then((res) => console.log(res))
    .catch((err) => console.log(err));
};

module.exports = { initializeBot };
