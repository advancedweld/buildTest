/*
 * @Author: engineMaster
 * @Date: 2023-07-29 16:01:31
 * @FilePath: \buildTest\src\mainVue.js
 * @Description:
 */
import { createApp, h } from 'vue';

import App from './App.vue';
// const App = {
//   render() {
//     //  <div><div>hello, Vue & Vite</div></div>
//     return h('div', null, h('div', null, String('hello, Vue & Vite')));
//   },
// };

createApp(App).mount(document.querySelector('#vueRoot'));
