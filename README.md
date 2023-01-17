# Coursera Subtitle Translation

开启 Coursera 课程视频的中英文双语字幕

-   如果课程同时存在中英文字幕，直接打开
-   如果课程没有中文字幕，自动翻译英文字幕

## 安装

下载项目，Chrome 打开扩展程序，加载已解压的扩展程序（需要打开开发者模式）

## 使用

在课程视频页面点击扩展图标即可

## 字幕設定

預設的設定是只有中文字幕，如要修改，請查看 `js/content.js`

```js
// line 37
for (let j = 0; j < translatedTextList.length; j++) {
    // 英文字幕 + 中文字幕
    // cues[cuesTextList[i][0] + j].text +=
    //     "\n" + translatedTextList[j];
    // 只有中文字幕
    cues[cuesTextList[i][0] + j].text = translatedTextList[j];
}
// More Code...
```

## 繁簡轉換

預設的設定是繁體中文，如要修改，請查看 `js/content.js`

```js
// line 79
function getTranslation(words, callback) {
    // 通过谷歌翻译 API 进行翻译，输入待翻译的字符串，返回翻译完成的字符串
    const xhr = new XMLHttpRequest();
    // 簡體中文
    // let url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=zh&dt=t&q=${encodeURI(
    //     words
    // )}`;
    // 繁體中文
    let url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=zh-tw&dt=t&q=${encodeURI(
        words
    )}`;
// More Code...
```
