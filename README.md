# Coursera Subtitle Translation

❤️ Fork from [tamshadow/coursera-subtitle-translation](https://github.com/tamshadow/coursera-subtitle-translation)

✔️ Supports MV3

開啟 Coursera 課程視頻的中英文雙語字幕

-   如果課程同時存在中英文字幕，直接打開
-   如果課程沒有中文字幕，自動翻譯英文字幕

## 影片教學 (推薦)

[![Watch the video](https://img.youtube.com/vi/-7baeklVEow/default.jpg)](https://youtu.be/-7baeklVEow)

## 安裝

下載項目，Chrome 打開擴展程序，加載已解壓的擴展程序（需要打開開發者模式）

## 使用

在課程視頻頁面點擊擴展圖標即可

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
    // 通過谷歌翻譯 API 進行翻譯，輸入待翻譯的字符串，返回翻譯完成的字符串
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

## 代辦事項

-   ✅ 修復 Listener (多重字幕問題)
-   ⬜️ 修復 `Uncaught (in promise) Error: Could not establish connection. Receiving end does not exist.` 錯誤
-   ⬜️ 新增 Extension Popup (讓使用者知道目前影片的字幕狀態)
-   ⬜️ 轉換成 Firefox Addon
