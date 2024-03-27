/*
 * @Author: xiangshangzhi
 * @Date: 2024-03-25 15:10:16
 * @FilePath: \buildTest\src\webpack-build\genPrompt.js
 * @Description: 读取文件夹里所有提示词文件，并将其组合成一个文件
 */
const path = require('path');
const fs = require('fs');

// 文件夹路径
const FILES_FLODER_PATH = 'C:/Users/xiang/Desktop/work/mj生图/20_img_gpt';

// 替换模板
const generateTemplate = (rowData) => {
  // 这里可以根据需要动态生成模板，rowData 为传入的内容
  return `${rowData} (best quality, masterpiece, photorealistic, realistic), 4K, (ti_fah_5-20000:0.8), <lora:0325_xhsfanahun12_Pro_LoRA:0.7>`;
};

const absPath = path.resolve(FILES_FLODER_PATH);

const process = (absPath) => {
  // 读取文件夹里的所有文件
  const fileNames = fs.readdirSync(absPath);
  const promptFiles = fileNames.filter((file) => file.includes('txt'));

  const rowDataArr = promptFiles.map((fileName) => {
    const filePath = path.join(absPath, fileName);
    const rowData = fs.readFileSync(filePath, 'utf-8');
    return generateTemplate(rowData);
  });

  const distPath = path.join(__dirname, './dist');
  if (!fs.existsSync(distPath)) {
    fs.mkdirSync(distPath);
  }

  fs.writeFileSync(path.join(distPath, `combine_prompt.js.${Date.now()}`), rowDataArr.join('\n'));
};

process(absPath);
