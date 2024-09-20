const path = require('path');
const fs = require('fs');

// node环境没有image对象，用sharp替代
const sharp = require('sharp');

const PIC_PATH_ARR = [263, 264, 265, 266, 267, 268].map((num) => `C:/Users/xsz/Desktop/personal/新建文件夹/照片/照片/${num}`);

// 目标文件夹路径
const OUTPUT_DIR = 'C:/Users/xsz/Desktop/personal/新建文件夹/照片/压缩后';
// 最大图片宽度或高度
const MAX_IMAGE_SIZE = 1024;

/** 压缩并保存图片 */
function compressAndSaveImages(imageDir, outputDir) {
  // 检查目标文件夹是否存在，不存在则创建
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // 读取图片文件夹中的所有文件
  fs.readdir(imageDir, (err, files) => {
    if (err) {
      console.error('读取图片文件夹出错:', err);
      return;
    }

    files.forEach((file) => {
      const filePath = path.join(imageDir, file);
      const fileExt = path.extname(file).toLowerCase();

      // 判断是否是图片文件（这里只判断常见的图片格式）
      if (fileExt === '.jpg' || fileExt === '.jpeg' || fileExt === '.png') {
        // 使用 sharp 读取和压缩图片
        sharp(filePath)
          .resize({
            width: MAX_IMAGE_SIZE,
            height: MAX_IMAGE_SIZE,
            fit: sharp.fit.inside, // 保持图片比例
          })
          .toBuffer() // 将图片转换为 Buffer 格式
          .then((data) => {
            // 生成新的文件名和路径
            const outputFilePath = path.join(outputDir, file);

            // 保存压缩后的图片
            fs.writeFile(outputFilePath, data, (err) => {
              if (err) {
                console.error('保存压缩后的图片出错:', err);
              } else {
                console.log(`图片已压缩并保存到: ${outputFilePath}`);
              }
            });
          })
          .catch((err) => {
            console.error('图片压缩出错:', err);
          });
      }
    });
  });
}

let tStart = Date.now();
// PIC_PATH_ARR.forEach((dir, index) => {
//   compressAndSaveImages(dir, `OUTPUT_DIR/${index}`);
// });

PIC_PATH_ARR.forEach((dir, index) => {
  compressAndSaveImages(dir, `${OUTPUT_DIR}/${index}`);
});
let tEnd = Date.now();
console.log(`耗时：${tEnd - tStart}ms`);
