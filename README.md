# Sharp 图片压缩

windows 下安装 sharp 时，需要安装 @img/sharp-win32-x64，其他平台访问 [NPM](https://www.npmjs.com/search?q=%40img%2Fsharp&page=0&perPage=20) 查找对应的包

```
pnpm i @img/sharp-win32-x64
```

## build

```
node esbuild index.js --bundle --platform=node --external:sharp
```

## run

```
node ./scripts/sharp/dist/bundle.js [dir]
```

```
node ./scripts/sharp/dist/bundle.js ./assets
```

## 输出

压缩后输出到 dir compressed 文件夹下

## 注意

默认 quality 80
