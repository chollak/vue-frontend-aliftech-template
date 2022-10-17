const path = require('path'); // Если ранее не была подключена зависимость

module.exports = {
  configureWebpack: {
    resolve: {
      alias: {
        '~': path.resolve(__dirname, 'src'),
        '@': path.resolve(__dirname, 'src'),
        '~~': path.resolve(__dirname, '.'),
        '@@': path.resolve(__dirname, '.'),
      },
    },
  },
};
