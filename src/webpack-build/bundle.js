// 获取主入口文件
const parser = require('@babel/parser');
const path = require('path');
const fs = require('fs');
const traverse = require('@babel/traverse').default;
const babel = require('@babel/core');
const generate = require('@babel/generator').default;
const crypto = require('crypto');

const getModuleInfo = (file) => {
  const filepath = path.join(__dirname, file);
  // console.log('🚀 ~ getModuleInfo ~ filepath:', filepath);

  if (!fs.existsSync(filepath)) {
    throw new Error('文件不存在');
  }
  const body = fs.readFileSync(filepath, 'utf-8');
  // console.log('@@@@@@@@@@body====\n', body);

  // 解析成ast
  const ast = parser.parse(body, {
    sourceType: 'module', //表示我们要解析的是ES模块
  });
  // console.log('@@@@ast===\n', ast);
  // console.log('@@@@ast.program.body===\n', ast.program.body);

  // 收集依赖
  const deps = {};
  traverse(ast, {
    /* ImportDeclaration方法代表的是对type类型为ImportDeclaration的节点的处理 */
    ImportDeclaration({ node }) {
      const dirname = path.dirname(file);
      console.log('@@@dirname==============', dirname); // ./src
      const abspath = './' + path.join(dirname, node.source.value);
      deps[node.source.value] = abspath;
    },

    /* 处理ast里的函数声明 */
    // FunctionDeclaration: function (path) {
    //   /* 改变函数名 */
    //   path.node.id.name = 'x';
    //   console.log('@@@FunctionDeclaration===', path.node);
    // },
  });
  console.log('@@@deps==============\n', deps);

  const result = generate(ast);
  // console.log('@@@result==============\n', result);
  /* 转换代码, es6转es5 */
  const { code } = babel.transformFromAst(ast, null, {
    presets: ['@babel/preset-env'],
  });
  // console.log('@@@@@@@@@@transformed code=====\n', code);

  /*我们返回了一个对象 ，这个对象包括该模块的路径（file），该模块的依赖（deps），该模块转化成es5的代码 */
  const moduleInfo = { file, deps, code };
  return moduleInfo;
};

/* 递归获取依赖 */
const parseModules = (file) => {
  const entry = getModuleInfo(file);
  const temp = [entry];
  for (let i = 0; i < temp.length; i++) {
    const deps = temp[i].deps;
    if (deps) {
      /* 遍历所有依赖，递归获取到依赖模块数据 */
      for (const key in deps) {
        if (deps.hasOwnProperty(key)) {
          temp.push(getModuleInfo(deps[key]));
        }
      }
    }
  }
  // console.log('@@@temp====\n', temp);

  /* 路径为key，{code，deps}为值的形式存储。因此，我们创建一个新的对象depsGraph。 */
  /**
   * ！注意：这里没有解决循环引用问题
   */
  const depsGraph = {}; //新增代码
  temp.forEach((moduleInfo) => {
    depsGraph[moduleInfo.file] = {
      deps: moduleInfo.deps,
      code: moduleInfo.code,
    };
  });
  // console.log('@@@@@@@@depsGraph==========\n', depsGraph);
  return depsGraph;
};

/* 实现require和export关键字 生成代码 */
const bundle = (file) => {
  const depsGraph = JSON.stringify(parseModules(file));
  return `(function (graph) {
      function require(file) {
          function absRequire(relPath) {
              return require(graph[file].deps[relPath])
          }
          var exports = {}
          ;(function (require,exports,code) {
              eval(code)
          })(absRequire,exports,graph[file].code)
          return exports
      }
      require('${file}')
  })(${depsGraph})`;
};

/* 拿到最终输出 */
const content = bundle('./sum.js');

//写入到我们的dist目录下
const distPath = path.join(__dirname, './dist');

if (fs.existsSync(distPath)) {
  // 递归地删除dist目录及其内容
  fs.rmSync(distPath, { recursive: true, force: true });
}

// 计算当前内容的哈希值
const newHash = crypto.createHash('md5').update(content).digest('hex');
const hashedFilename = `bundle.${newHash}.js`;

// 写入新内容
fs.mkdirSync(distPath);
fs.writeFileSync(path.join(distPath, hashedFilename), content);

/* 异步读取文件 */
// const asyncGetModuleInfo = (file) => {
//   const body = fs.readFile(file, 'utf-8', (err, data) => {
//     if (err) {
//       console.log('@@@@@@@@@@err====', err);
//     } else {
//       console.log('@@@@@@@@@@dataasync====\n', data);
//     }
//   });
// };

// asyncGetModuleInfo('./src/index.js');
