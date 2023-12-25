const { log } = require('console');
const fs = require('fs');
const path = require('path');

const routesInit = (app) => {
    console.log('heheh');
    fs.readdirSync(__dirname)
        .filter((filename) => filename !== path.basename(__filename))
        .filter((filename) => filename !== 'index.js')
        .map((filename) => path.join(__dirname, filename))
        .forEach((modulePath) => {
            console.log('modulePath', modulePath);
            const route = require(modulePath);

            route.init(app, app.get("models"));
        });
};

module.exports = { routesInit };