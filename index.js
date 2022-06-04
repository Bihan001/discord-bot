const http = require('http');
const Discord = require('discord.js');
const { joinVoiceChannel,createAudioPlayer, createAudioResource } = require('@discordjs/voice');
const ytdl = require('ytdl-core');

const DISCORD_BOT_TOKEN = process.env['DISCORD_BOT_TOKEN'];
const BOT_PREFIX = 'kono!';
const streamOptions = {seek: 0, volume: 1};

http.createServer((req, res) => {
  res.write('Hello!');
  res.end();
}).listen(5000);

console.log('Started');

const player = createAudioPlayer();

const intents = Object.keys(Discord.Intents.FLAGS);

const client = new Discord.Client({ restTimeOffset: 0, intents, partials: ['MESSAGE', 'CHANNEL', 'REACTION'] });


client.on('ready', () => {
  console.log(`${client.user.username} ready!`);
  client.user.setActivity('in the path of life', { type: 'Lost' });
});


client.on('messageCreate', msg => {
  if (msg.author.bot) return;
  const [prefix, command, data, ...rest] = msg.content.split(' ').map(x => x.trim());
  if(prefix !== BOT_PREFIX) return;
  if(command === 'poke') {
    return msg.channel.send('konoo');
  }
  if(command === 'pause') {
    return player.pause();
  }
  if(command === 'resume') {
    return player.unpause();
  }
  if(command === 'stop') {
    return player.stop();
  }
  if(command === 'play') {
    const url = data;
    const voice = msg.member.voice;
    if(!voice.channelId) return msg.reply('Join a voice channel first konooo');
    const connection = joinVoiceChannel({
      channelId: voice.channel.id,
      guildId: msg.guild.id,
      adapterCreator: msg.guild.voiceAdapterCreator
    });
    const stream = ytdl(url, { filter: 'audioonly' });
    const resource = createAudioResource(stream);
    player.play(resource);
    connection.subscribe(player);
    player.addListener("stateChange", (oldOne, newOne) => {
    if (newOne.status == "idle") {
        connection.destroy();
    }
});
  }
});

client.on("warn", console.info);
client.on("error", console.error);

client.login(DISCORD_BOT_TOKEN).then(res => console.log(res)).catch(err => console.log(err));
