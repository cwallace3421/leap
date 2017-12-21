const path = require('path');
const shell = require('shelljs');

shell.cp(path.resolve(__dirname, 'src', 'server', 'config.json'), path.resolve(__dirname, 'dist', 'server'));