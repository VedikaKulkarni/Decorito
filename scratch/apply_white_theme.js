const fs = require('fs');
const path = require('path');

function processDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            processDir(fullPath);
        } else if (fullPath.endsWith('.js') || fullPath.endsWith('.jsx')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            let originalContent = content;

            // Use string splitting for exact match instead of dealing with regex escaping
            content = content.split('bg-[#f7f5f2]').join('bg-white');
            content = content.split('bg-gradient-to-b from-[#fdfdfb] to-[#f7f4f1]').join('bg-white');

            if (content !== originalContent) {
                fs.writeFileSync(fullPath, content, 'utf8');
                console.log('Updated background in', fullPath);
            }
        }
    }
}

processDir(path.join(__dirname, '../frontend/src'));
