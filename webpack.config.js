const path = require('path');

module.exports = {
  entry: './src/alpine.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'public/javascripts'),
  },
  mode: 'production',
};
