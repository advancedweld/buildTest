// https://www.bilibili.com/video/BV1Mm42137tk/?spm_id_from=333.337.search-card.all.click&vd_source=353d2e2df844826667e307f196dfa6bb
export default {
  input: 'src/main.js',
  output: {
    file: 'dist/bundle.cjs.js',
    format: 'cjs', // amd/esm/iife/umd/cjs
    name: 'bundleName',
  },
};
