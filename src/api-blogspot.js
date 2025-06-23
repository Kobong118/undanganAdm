// services/blogFetcher.js
const axios = require('axios');

async function fetchFromBlogger() {
  try {
  const url = 'https://admmedialine.blogspot.com/feeds/posts/default?alt=json';
  const response = await axios.get(url);
  return response.data;
  } catch (error) {
    const response = `<div class='w-full h-52 flex flex-col justify-center items-center'>
    <h1 class="text-2xl">Error fetching data from Blogger</h1>
    <p>
     ${error}</p>
    </div>`
    return response
  }
}

module.exports = fetchFromBlogger;
