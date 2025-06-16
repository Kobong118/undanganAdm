// services/blogFetcher.js
const axios = require('axios');

async function fetchFromBlogger() {
  const url = 'https://admmedialine.blogspot.com/feeds/posts/default?alt=json';
  const response = await axios.get(url);
  return response.data;
}

module.exports = fetchFromBlogger;
