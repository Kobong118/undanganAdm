const fs = require('fs');

const dataPath =path.join(__dirname, 'src', 'dataTextContent.json');


const loadTextContent =()=>{
    const fileBuffer = fs.readFileSync(dataPath,'utf-8');
    const textsContents = JSON.parse(fileBuffer);
    return textsContents;
}

module.exports = {loadTextContent}
