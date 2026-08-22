const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/data/exercise-assets.ts');
let content = fs.readFileSync(filePath, 'utf-8');

// Replace any occurrence of `"ready"\n` followed by whitespace and `imageUrl:`
// The previous regex might have had issues with \r\n vs \n
content = content.replace(/"ready"\s+imageUrl:/g, '"ready",\n    imageUrl:');
content = content.replace(/"unavailable"\s+imageUrl:/g, '"unavailable",\n    imageUrl:');

fs.writeFileSync(filePath, content, 'utf-8');
console.log('Fixed missing commas');
