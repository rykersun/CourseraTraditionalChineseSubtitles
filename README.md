# 簡介

一款簡易好用的 Coursera 字幕翻譯工具。

# 需求

要使用這款工具，你需要安裝 Google Chrome。

# 下載

連結: https://github.com/rykersun/CourseraTraditionalChineseSubtitles/archive/refs/heads/main.zip

# 安裝

**解壓縮剛剛下載的檔案，你會得到一個資料夾，那個資料夾裡面的資料夾才是我們要的東西**

-   打開 Google Chrome
-   點擊右上角的三個點 > 更多工具 > 擴充功能
-   打開右上角的開發人員模式
-   點擊左上角的載入未封裝項目 > 選擇`我們要的東西`

## 固定到 Google Chrome (可選)

點擊左上角的擴充功能，可以將這款工具固定在狀態列，這樣以後只要在播放影片時點擊圖示，就可以啟用字幕。

# 設定

使用任何文字編輯器打開 `js/content.js`。

_第五行_

```js
// User Settings
let motherLanguage = "zh-TW"; // 你看得懂的語言
let bilingualSubtitle = false; // 是否要啟用雙字幕 (優先使用英文)
```

注意: 設定 `motherLanguage` 請參考 `js/languages.js` 裡面的語言。

# 貢獻

本專案 folk 自: https://github.com/tamshadow/coursera-subtitle-translation

**如果有任何錯誤，歡迎發送 PR。**
