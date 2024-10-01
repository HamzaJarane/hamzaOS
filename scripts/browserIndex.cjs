const fs = require('fs');
const path = require('path');

const allowedFolders = [
    {
        name: "desktop",
        files: []
    },
    {
        name: "music",
        files: []
    },
    {
        name: "pictures",
        files: []
    },
    {
        name: "videos",
        files: []
    },
    {
        name: "documents",
        files: []
    }
];

try {
    allowedFolders.forEach((allowedFolder) => {
        const dir = `${__dirname}/../public/static/${allowedFolder.name}`;
        if(!fs.existsSync(dir)) return;
        const files = fs.readdirSync(dir, { withFileTypes: true });

        allowedFolder.files = files.map((file) => {
            let size = 0;

            try {
                size = Math.round(fs.readFileSync(`${file.parentPath}/${file.name}`).byteLength / (1024 * 1024)).toFixed(2)
            } catch (error) {
                size = Math.round(fs.readFileSync(`${file.path}/${file.name}`).byteLength / (1024 * 1024)).toFixed(2)
            }
            
            return {
                name: file.name,
                size: size,
                staticPath: `/static/${allowedFolder.name}/${file.name}`,
                type: file.isFile() ? 'file' : 'folder',
                ext: path.extname(`${file.parentPath}/${file.name}`),
            }
        });
    });
} finally {
    fs.writeFileSync(`${__dirname}/../public/static/documents/browser.json`, JSON.stringify(allowedFolders));
}