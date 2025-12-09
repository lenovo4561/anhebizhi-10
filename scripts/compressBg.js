const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

// 需要压缩的背景图路径
const bgPath = path.join(__dirname, '../src/img/loading-bg.png');

async function compressBg() {
  try {
    const originalStats = fs.statSync(bgPath);
    console.log(`原始文件大小: ${(originalStats.size / 1024).toFixed(2)} KB`);

    const image = sharp(bgPath);
    const metadata = await image.metadata();
    console.log(`图片尺寸: ${metadata.width}x${metadata.height}`);

    // 压缩背景图，降低质量
    await image
      .resize(Math.round(metadata.width / 2), Math.round(metadata.height / 2))  // 缩小一半
      .png({
        compressionLevel: 9,
        quality: 70
      })
      .toFile(bgPath + '.tmp');

    fs.unlinkSync(bgPath);
    fs.renameSync(bgPath + '.tmp', bgPath);

    const compressedStats = fs.statSync(bgPath);
    console.log(`压缩后文件大小: ${(compressedStats.size / 1024).toFixed(2)} KB`);
    console.log(`压缩率: ${((1 - compressedStats.size / originalStats.size) * 100).toFixed(2)}%`);
  } catch (error) {
    console.error('压缩失败:', error);
  }
}

compressBg();
