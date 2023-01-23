// Google Translate API Variables
let translateTarget;
let translateResult = "zh-tw";
async function openBilingual() {
    // 開啟雙語字幕
    let tracks = document.getElementsByTagName("track");
    let target;
    let zh;
    let languages = [
        "af",
        "sq",
        "am",
        "ar",
        "hy",
        "as",
        "ay",
        "az",
        "bm",
        "eu",
        "be",
        "bn",
        "bho",
        "bs",
        "bg",
        "ca",
        "ceb",
        "co",
        "hr",
        "cs",
        "da",
        "dv",
        "doi",
        "nl",
        // "en",
        "eo",
        "et",
        "ee",
        "fil",
        "fi",
        "fr",
        "fy",
        "gl",
        "ka",
        "de",
        "el",
        "gn",
        "gu",
        "ht",
        "ha",
        "haw",
        "he",
        "hi",
        "hmn",
        "hu",
        "is",
        "ig",
        "ilo",
        "id",
        "ga",
        "it",
        "ja",
        "jv",
        "kn",
        "kk",
        "km",
        "rw",
        "gom",
        "ko",
        "kri",
        "ku",
        "ckb",
        "ky",
        "lo",
        "la",
        "lv",
        "ln",
        "lt",
        "lg",
        "lb",
        "mk",
        "mai",
        "mg",
        "ms",
        "ml",
        "mt",
        "mi",
        "mr",
        "mni-Mtei",
        "lus",
        "mn",
        "my",
        "ne",
        "no",
        "ny",
        "or",
        "om",
        "ps",
        "fa",
        "pl",
        "pt",
        "pa",
        "qu",
        "ro",
        "ru",
        "sm",
        "sa",
        "gd",
        "nso",
        "sr",
        "st",
        "sn",
        "sd",
        "si",
        "sk",
        "sl",
        "so",
        "es",
        "su",
        "sw",
        "sv",
        "tl",
        "tg",
        "ta",
        "tt",
        "te",
        "th",
        "ti",
        "ts",
        "tr",
        "tk",
        "ak",
        "uk",
        "ur",
        "ug",
        "uz",
        "vi",
        "cy",
        "xh",
        "yi",
        "yo",
        "zu",
    ];
    if (tracks.length) {
        // 1.1 遍歷字幕節點，找到外文字幕
        for (let i = 0; i < tracks.length; i++) {
            // 優先尋找英文
            if (tracks[i].srclang === "en") {
                target = tracks[i];
                translateTarget = "en";
                break;
            }
            for (let j = 0; j < languages.length; j++) {
                if (tracks[i].srclang === languages[j]) {
                    target = tracks[i];
                    translateTarget = languages[j]; // Use in Google Translate API
                }
            }
        }
        // 1.2 遍歷字幕節點，找到中文字幕
        for (let i = 0; i < tracks.length; i++) {
            // 優先尋找繁體中文，如果沒有就使用簡體中文
            if (tracks[i].srclang === "zh-TW") {
                zh = tracks[i];
            }
            // else if (tracks[i].srclang === "zh-CN") {
            //     zh = tracks[i];
            // }
        }
        // 2. 如果英文字幕存在，打開
        if (target) {
            target.track.mode = "showing";
            // 3. 判定中文字幕是否存在, 如果存在，直接打開
            if (zh) {
                zh.track.mode = "showing";
            } else {
                // 4. 如果不存在，開啟翻譯
                // Chrome 更新到 74 以後
                // 似乎首次設置 track.mode = 'showing' 到 cues 加載完畢之間有延遲？
                // 暫時先用 sleep 讓 cues 有充足的時間加載字幕以確保正常工作，稍後再來解決
                await sleep(500);
                let cues = target.track.cues;
                // 由於逐句翻譯會大量請求翻譯 API，需要減少請求次數
                const cuesTextList = getCuesTextList(cues);
                // 進行翻譯
                for (let i = 0; i < cuesTextList.length; i++) {
                    getTranslation(cuesTextList[i][1], (translatedText) => {
                        // 取得返回的文本，根據之前插入的換行符 split
                        // 然後確定所在 cues 文本的序列，為之前存儲的起始位置 + 目前的相對位置
                        // 把翻譯後的文本直接添加到英文字幕後面
                        const translatedTextList = translatedText.split("\n\n");
                        for (let j = 0; j < translatedTextList.length; j++) {
                            // 英文字幕 + 中文字幕
                            // cues[cuesTextList[i][0] + j].text +=
                            //     "\n" + translatedTextList[j];
                            // 只有中文字幕
                            cues[cuesTextList[i][0] + j].text =
                                translatedTextList[j];
                        }
                    });
                }
            }
        }
    }
}

function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

function getCuesTextList(cues) {
    // 取出字幕的所有文本內容，整合成為一個列表
    // 每項為不大於 5000 字的字符串，（好像目前使用的這個 API 有 5000 字上限？）
    // 以及它在 cues 的起始位置
    // 返回的數據結構大概是 [[0, 文本], [95, 文本]]
    let cuesTextList = [];
    for (let i = 0; i < cues.length; i++) {
        if (
            cuesTextList.length &&
            cuesTextList[cuesTextList.length - 1][1].length +
                cues[i].text.length <
                5000
        ) {
            // 需要插入一個分隔符(換行)，以便之後為翻譯完的字符串 split
            // 用兩個換行符來分割，因為有的視頻字幕是自帶換行符
            cuesTextList[cuesTextList.length - 1][1] += "\n\n" + cues[i].text;
        } else {
            cuesTextList.push([i, cues[i].text]);
        }
    }
    return cuesTextList;
}

function getTranslation(words, callback) {
    // 通過谷歌翻譯 API 進行翻譯，輸入待翻譯的字符串，返回翻譯完成的字符串
    const xhr = new XMLHttpRequest();
    let url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${translateTarget}&tl=${translateResult}&dt=t&q=${encodeURI(
        words
    )}`;
    xhr.open("GET", url, true);
    xhr.responseType = "text";
    xhr.onload = function () {
        if (xhr.readyState === xhr.DONE) {
            if (xhr.status === 200 || xhr.status === 304) {
                // 返回的翻譯文本大概是
                // [[["你好。","hello.",null,null,1],["你好","hello",null,null,1]],null,"en"]
                // 這樣的字符串
                // 需要將結果拼接成完整的整段字符串
                const translatedList = JSON.parse(xhr.responseText)[0];
                let translatedText = "";
                for (let i = 0; i < translatedList.length; i++) {
                    translatedText += translatedList[i][0];
                }
                callback(translatedText);
            }
        }
    };
    xhr.send();
}

// 設置監聽，如果接收到請求，執行開啟雙語字幕函數
chrome.runtime.onMessage.addListener(function (request, sender) {
    openBilingual();
});
