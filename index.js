const http = require('http');
const Discord = require('discord.js');
const ytdl = require('ytdl-core');

const DISCORD_BOT_TOKEN = process.env['DISCORD_BOT_TOKEN'];

http.createServer((req, res) => {
  res.write('Hello!');
  res.end();
}).listen(5000);

console.log('Started')

const intents = Object.keys(Discord.Intents.FLAGS);

const client = new Discord.Client({ restTimeOffset: 0, intents, partials: ['MESSAGE', 'CHANNEL', 'REACTION'] });




client.on('ready', () => {
  console.log(`${client.user.username} ready!`);
  client.user.setActivity('in the path of life', {type: 'Lost'});
});


client.on('messageCreate', msg => {
  if(msg.author.bot) return;
  console.log(msg.content);
  msg.channel.send('Ok Bhai');
});

client.on("warn",  console.info);
client.on("error", console.error);

client.login(DISCORD_BOT_TOKEN).then(res => console.log(res)).catch(err => console.log(err));
