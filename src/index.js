/* 后端服务，支持esmodule */

const fs = require('fs');
const path = require('path');
const Koa = require('koa');
const app = new Koa();
app.use(async (ctx) => {
  const { url, query } = ctx.request;
  console.log('url:', url);
  console.log('query====\n', query);

  //  index.html
  if (url === '/') {
    ctx.type = 'text/html';
    const filePath = path.join(__dirname, 'index.html');
    const content = fs.readFileSync(filePath, 'utf-8');
    // console.log('content====\n', content);
    ctx.body = content;
  } else if (url.endsWith('.js')) {
    /* 请求js */
    console.log('@@@@@__dirname: ', __dirname); //  D:\github\buildTest\src
    // url.slice(5): /src/main.js => main.js
    const apiPath = path.resolve(__dirname, url.slice(5));

    console.log('@@@@@apiPath: ', apiPath);

    const content = fs.readFileSync(apiPath, 'utf-8');
    ctx.type = 'application/javascript';
    ctx.body = content;
  }
});
app.listen(3001, () => {
  console.log('server is running 3001');
});
