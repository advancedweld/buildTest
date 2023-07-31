/* 后端服务，支持esmodule */
const PREFIX = '/@modules';
const fs = require('fs');
const path = require('path');
const Koa = require('koa');
/* 用来解析.vue单文件组件 */
const compilerSfc = require('@vue/compiler-sfc');
const compilerDom = require('@vue/compiler-dom');
const app = new Koa();
// console.log('@@@@@__dirname: ', __dirname); //  D:\github\buildTest\src

/* esmodule中 __dirname未定义，不能直接使用 */
// const __dirname = dirname(fileURLToPath(import.meta.url));
app.use(async (ctx) => {
  const { url, query } = ctx.request;

  //  => index.html
  if (url === '/') {
    stratages.returnHtml(url, ctx);
  } else if (url.endsWith('.js')) {
    stratages.returnJs(url, ctx);
  }
  // 第三方库支持  vue => node_modules/vue 也就是既不是绝对路径也不是相对路径
  else if (url.startsWith(PREFIX)) {
    stratages.returnThirdLib(url, ctx);
  }
  // .vue文件 ==> .js文件
  else if (url.includes('.vue')) {
    stratages.returnSfc(url, ctx, query);
  }

  // css文件支持
});

app.listen(3001, () => {
  console.log('server is running 3001');
});

/**
 * @description: 改写函数，将第三方库改写成绝对路径引引用
 * @param {*} path 相对路径
 * @return {*}
 */
function rewriteImport(path) {
  /* 正则表达式注意别写错了，空格要小心 */
  return path.replace(/from ['"]([^'"]+)['"]/g, replacer);
}

function replacer(match, s1) {
  // console.log('@@@@match:', match);
  /* is not a relative path ,like './module' */
  if (!s1.startsWith('.')) {
    const apiPath = `${PREFIX}/${s1}`;
    return `from '${apiPath}'`;
  }
  return match;
}

const stratages = {
  returnHtml: function (url, ctx) {
    ctx.type = 'text/html';
    const filePath = path.resolve(__dirname, 'index.html');
    let content = fs.readFileSync(filePath, 'utf-8');

    /* 入口文件加入环境变量 否则会报错‘process is not defined’ */
    content = content.replace(
      '<script',
      `<script>
    window.process = {env: {NODE_ENV: 'development'}}
    </script>
    <script`
    );
    ctx.body = content;
  },
  returnJs: function (url, ctx) {
    /* 请求js */
    // url.slice(5): /src/main.js => main.js
    const apiPath = path.resolve(__dirname, url.slice(5));
    console.log('@@@apiPath:', apiPath);
    const content = fs.readFileSync(apiPath, 'utf-8');
    ctx.type = 'application/javascript';
    /* 改写import并返回 */
    ctx.body = rewriteImport(content);
  },

  /* 第三方库解析 */
  returnThirdLib: function (url, ctx) {
    // /@node_modules/vue 的es入口
    // 读取package.json文件 module字段
    const prefix = path.resolve(__dirname.replace('src', ''), url.replace(PREFIX, 'node_modules'));
    console.log('@@@prefix:', prefix);

    let filePath;
    /* 不存在package.json,直接读取.js文件 */
    if (!fs.existsSync(prefix + '/package.json')) {
      filePath = `${prefix}.js`;
    } else {
      //node_modules\vue\package.json
      const modulePath = path.resolve(prefix, 'package.json');
      /* packaje.json中module字段指示了es模块入口 */
      const module = require(modulePath).module || require(modulePath).main;
      console.log('@@@module:', module);
      filePath = path.resolve(prefix, module);
    }

    // console.log('@@@filePath:', filePath);
    const content = fs.readFileSync(filePath, 'utf-8');
    ctx.type = 'application/javascript';
    ctx.body = rewriteImport(content);
  },

  /* .vue单文件文件解析 */
  returnSfc: function (url, ctx, query) {
    //  *.vue?type=template
    const filePath = path.resolve(__dirname, url.split('?')[0].slice(5));
    console.log('@@@filePath:', filePath);

    const rowContent = fs.readFileSync(filePath, 'utf-8');

    if (!query.type) {
      // 第一步， .vue文件 => template.script (compiler-sfc)
      const { descriptor } = compilerSfc.parse(rowContent);
      if (!query.type) {
        ctx.type = 'application/javascript';
        ctx.body = `
       ${rewriteImport(descriptor.script.content.replace('export default ', 'const __script = '))}
       import { render as __render } from "${url}?type=template"
       __script.render = __render
       export default __script
       `;
      }
    } else {
      // 第二步， template模板 => template.render  (compiler-dom)
      const { descriptor } = compilerSfc.parse(rowContent);
      const template = descriptor.template;
      const render = compilerDom.compile(template.content, { mode: 'module' }).code;
      ctx.type = 'application/javascript';
      ctx.body = rewriteImport(render);
    }
  },
};
