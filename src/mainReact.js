import * as React from 'react';
import * as reactClient from 'react-dom/client';

// import { title } from './moduleA.js';

// console.log('@@@@@@@@@@@@@@title is===', title);

function App() {
  //  <div><div>hello,  React & vite</div></div>
  return React.createElement('div', null, React.createElement('div', null, 'hello, React & vite'));
}

const root = reactClient.createRoot(document.querySelector('#reactRoot')); // createRoot(container!) if you use TypeScript
root.render(React.createElement(App));

// 生成指定个数的斐波那契数列
function* generateFib(COUNT) {
  let count = 0;
  let a = 1,
    b = 1;
  while (count < COUNT) {
    const sum = a + b;
    yield sum;
    a = b;
    b = sum;
    count++;
  }
}

const fib20 = generateFib(20);
console.log('@@@', [...fib20]);
