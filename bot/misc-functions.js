const axios = require('axios');
const { audios } = require('../utilities');
const { playAudio } = require('./player');

const getRandomImage = (message, type = 'sfw', tag = 'waifu') => {
  axios.get(`https://api.waifu.pics/${type}/${tag}`).then((res) => message.channel.send({ files: [res.data.url] }));
};

const audioPlay = (msg, key) => {
  const url = audios[key];
  if (!url) throw new Error('No audio found');
  playAudio(msg, url);
};

module.exports = { getRandomImage, audioPlay };
