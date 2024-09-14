const fs = require('fs');

const dataPath ="./src/dataTextContent.json"

const loadTextContent =()=>{
    const fileBuffer = fs.readFileSync(dataPath,'utf-8');
    const textsContents = JSON.parse(fileBuffer);
    return textsContents;
}

module.exports = {loadTextContent}
