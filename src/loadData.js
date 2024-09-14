const fs = require('fs');
const path = require('path');

const dataPath =path.join(__dirname, 'dataTextContent.json');


const loadTextContent =()=>{
    const fileBuffer = fs.readFileSync(dataPath,'utf-8');
    const textsContents = JSON.parse(fileBuffer);
    return textsContents;
}

module.exports = {loadTextContent}
