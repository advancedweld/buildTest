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
