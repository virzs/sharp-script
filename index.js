import sourceMapSupport from "source-map-support";
import sharp from "sharp";
import { globSync } from "glob";
import fs from "fs";
import chalk from "chalk";
import path from "path";
import { filesize } from "filesize";

sourceMapSupport.install();

async function compressImage(image) {
  // 获取命令行参数
  const dir = process.argv[2];

  // 获取绝对路径
  const absolutePath = path.resolve(dir);

  const images = globSync(`${absolutePath}/**/*.{jpg,jpeg,png,webp}`);

  console.log(
    chalk.yellow(
      `Compressing images in ${absolutePath}, Found ${images.length} images`
    )
  );

  const compressedDir = path.join(absolutePath, "compressed");

  // 在当前路径下 创建一个 compressed 文件夹
  if (!fs.existsSync(compressedDir)) {
    fs.mkdirSync(compressedDir);
  } else {
    console.log(chalk.yellow("Cleaning up compressed folder..."));
    // 清空上次压缩的图片，保留 compressed 文件夹
    fs.rmSync(compressedDir, { recursive: true });
    fs.mkdirSync(compressedDir);
  }

  const results = [];

  for (const image of images) {
    //   获取图片文件名和后缀
    const imageName = path.basename(image).split(".")[0];
    const imageExt = path.extname(image).slice(1);
    const fullName = path.basename(image);

    const { size: originalSize } = fs.statSync(`${absolutePath}/${fullName}`);

    let newName = `${compressedDir}/${imageName}.${imageExt}`;

    const isExist = fs.existsSync(newName);

    if (isExist) {
      const random = Math.floor(Math.random() * 1000);
      newName = `${compressedDir}/${imageName}-${random}.${imageExt}`;
    }

    if (imageExt === "webp") {
      await sharp(image).resize().webp({ quality: 80 }).toFile(newName);
    } else if (imageExt === "png") {
      await sharp(image).resize().png({ quality: 80 }).toFile(newName);
    } else if (imageExt === "jpg" || imageExt === "jpeg") {
      await sharp(image).resize().jpeg({ quality: 80 }).toFile(newName);
    }

    const { size: newSize } = fs.statSync(newName);

    if (isExist) {
      // 重命名为原来的名字
      fs.renameSync(newName, `${compressedDir}/${imageName}.${imageExt}`);
    }

    results.push({
      filename: fullName,
      "original size": filesize(originalSize, { standard: "jedec" }),
      "new size": filesize(newSize, { standard: "jedec" }),
    });
  }

  // 输出table fileName originalSize newSize
  console.table(results, ["filename", "original size", "new size"]);

  console.log(chalk.green("Compression completed!"));
}

compressImage();
