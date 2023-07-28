const fs = require('fs');
const path = require('path');
const Koa = require('koa');
const app = new Koa();
app.use(async (ctx) => {
  const { url, query } = ctx.request;
  console.log('url====\n', url);
  console.log('query====\n', query);
  if (url === '/') {
    ctx.type = 'text/html';

    const filePath = path.join(__dirname, 'index.html');
    const content = fs.readFileSync(filePath, 'utf-8');
    console.log('content====\n', content);
    ctx.body = content;
  }
});
app.listen(3001, () => {
  console.log('server is running 3001');
});
