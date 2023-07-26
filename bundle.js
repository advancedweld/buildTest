// 获取主入口文件
const parser = require('@babel/parser');
const path = require('path');
const fs = require('fs');
const traverse = require('@babel/traverse').default;
const babel = require('@babel/core');

const getModuleInfo = (file) => {
  const body = fs.readFileSync(file, 'utf-8');
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
      // console.log('@@@dirname==============', dirname); // ./src
      const abspath = './' + path.join(dirname, node.source.value);
      deps[node.source.value] = abspath;
    },
  });
  // console.log('@@@deps==============\n', deps);

  /* 转换代码, es6转es5 */
  const { code } = babel.transformFromAst(ast, null, {
    presets: ['@babel/preset-env'],
  });
  // console.log('@@@@@@@@@@transformed code=====\n', code);

  /*我们返回了一个对象 ，这个对象包括该模块的路径（file），该模块的依赖（deps），该模块转化成es5的代码 */
  const moduleInfo = { file, deps, code };
  return moduleInfo;
};

// getModuleInfo('./src/index.js');
// getModuleInfo('./src/indexTest.js');
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
// parseModules('./src/index.js');

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
const content = bundle('./src/index.js');

console.log('@@@@@@@@@@content=====\n', content);

//写入到我们的dist目录下
fs.mkdirSync('./dist');
fs.writeFileSync('./dist/bundle.js', content);

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
