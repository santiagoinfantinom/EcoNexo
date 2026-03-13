const fs = require('fs');
const path = require('path');

const apiPath = path.join(__dirname, '..', 'src', 'app', 'api');
const hiddenApiPath = path.join(__dirname, '..', 'src', 'app', '_api_hidden');

const action = process.argv[2];

if (action === 'hide') {
    if (fs.existsSync(apiPath)) {
        console.log('Hiding API directory for static build...');
        fs.renameSync(apiPath, hiddenApiPath);
    } else {
        console.log('API directory already hidden or not found.');
    }
} else if (action === 'restore') {
    if (fs.existsSync(hiddenApiPath)) {
        console.log('Restoring API directory...');
        fs.renameSync(hiddenApiPath, apiPath);
    } else {
        console.log('Hidden API directory not found.');
    }
} else {
    console.log('Usage: node toggle-api.js [hide|restore]');
}
