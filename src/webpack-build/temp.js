/*
 * @Author: xiangshangzhi
 * @Date: 2024-03-25 15:10:16
 * @FilePath: \buildTest\src\webpack-build\temp.js
 * @Description: 处理提示词，按照模板生成批量提示词
 */
const path = require('path');
const fs = require('fs');

const srcObj = require('./promptData.js');

const process = (rowData) => {
  const labels = rowData.map((item) => {
    // 原始提示词
    // const rowPrompt = JSON.parse(item.label).caption;
    const rowPrompt = item.label;
    return `fahstyle, ${rowPrompt}, ti_fah_5-3000, (best quality, masterpiece, photorealistic, realistic), 4K, <lora:0331_xhsfanahun11_2_Pro_LoRA:0.65>`;
  });
  console.log('@@@@format', labels);

  const promptPath = path.join(__dirname, './prompt');
  if (fs.existsSync(promptPath)) {
    // 递归地删除dist目录及其内容
    fs.rmSync(promptPath, { recursive: true, force: true });
  }

  fs.mkdirSync(promptPath);
  fs.writeFileSync(path.join(promptPath, 'batch_prompt.js'), labels.join('\n'));
};

process(srcObj);
