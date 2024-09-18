const path = require('path');
const fs = require('fs');
const xlsx = require('xlsx');

// 文件路径
const FILE_PATH = './picName.xls';
const absPath = path.resolve(__dirname, FILE_PATH);

const PIC_PATH = 'C:/Users/xsz/Desktop/personal/新建文件夹/263';
const PIC_PATH_ARR = [
  'C:/Users/xsz/Desktop/personal/新建文件夹/263',
  'C:/Users/xsz/Desktop/personal/新建文件夹/264',
  'C:/Users/xsz/Desktop/personal/新建文件夹/265',
  'C:/Users/xsz/Desktop/personal/新建文件夹/266',
  'C:/Users/xsz/Desktop/personal/新建文件夹/267',
  'C:/Users/xsz/Desktop/personal/新建文件夹/268',
];
// 处理函数
const processFile = (filePath) => {
  // 检查文件是否存在
  if (!fs.existsSync(filePath)) {
    console.error('文件不存在:', filePath);
    return;
  }

  // 读取 Excel 文件
  const workbook = xlsx.readFile(filePath);

  // 获取第一个工作表
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];

  // 将工作表转换为 JSON 数据
  const data = xlsx.utils.sheet_to_json(sheet);

  // 打印数据
  // console.log('Excel 数据:', data);
  const result = data.reduce((pre, cur) => {
    return {
      ...pre,
      [cur.__EMPTY_2]: {
        name: cur['__EMPTY'],
        class: cur['一年级拍照顺序'],
        order: cur['__EMPTY_1'],
      },
    };
  }, {});
  // console.log('🚀 ~ result ~ result:', result);
  return result;
};

const metaData = processFile(absPath);
const renameFile = (folderPath, metaData) => {
  const files = fs.readdirSync(folderPath);

  files.forEach((file) => {
    // 假设文件名中包含顺序号，并提取文件的顺序号部分（这里假设文件名格式如 '0124.jpg'）
    const fileOrder = path.basename(file, path.extname(file)); // 获取文件名不含扩展名部分
    console.log('🚀 ~ fileOrder ~ fileOrder:', fileOrder);
    // 在元数据中查找对应的身份证号
    const matchingEntry = Object.entries(metaData).find(([id, data]) => data.order === fileOrder);

    if (matchingEntry) {
      const [id, data] = matchingEntry;
      const oldFilePath = path.join(folderPath, file);
      const newFilePath = path.join(folderPath, `${id}${path.extname(file)}`);

      // 重命名文件
      fs.renameSync(oldFilePath, newFilePath);
      console.log(`已将文件 ${file} 重命名为 ${id}${path.extname(file)}`);
    } else {
      console.log(`未找到文件 ${file} 的匹配数据`);
    }
  });
};

let tStart = Date.now();
PIC_PATH_ARR.forEach((item) => {
  renameFile(item, metaData);
});
let tEnd = Date.now();
console.log(`耗时：${tEnd - tStart}ms`);
// renameFile(PIC_PATH, metaData);
