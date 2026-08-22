const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/data/exercise-assets.ts');
let content = fs.readFileSync(filePath, 'utf-8');

// The issue is: `status: "ready"\n  \n    imageUrl:`
// Or `status: "unavailable"\n  \n    imageUrl:`
// Let's just replace `"\n  \n    imageUrl:` with `",\n    imageUrl:`
content = content.replace(/"ready"\r?\n\s*\r?\n\s*imageUrl:/g, '"ready",\n    imageUrl:');
content = content.replace(/"unavailable"\r?\n\s*\r?\n\s*imageUrl:/g, '"unavailable",\n    imageUrl:');

fs.writeFileSync(filePath, content, 'utf-8');
console.log('Fixed missing commas');
