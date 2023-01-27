let foreignLanguage;
let subtitleStatus = false;

// User Settings
let motherLanguage = "zh-TW";
let bilingualSubtitle = false;

async function openSubtitle() {
    let defaultTracks = document.getElementsByTagName("track");
    let foreignSubtitles;
    let motherSubtitles;
    const sourceLanguages = chrome.runtime.getURL("js/languages.js");
    const courseraTracks = await import(sourceLanguages);
    courseraTracks.languages = courseraTracks.languages.filter(
        (item) => item !== motherLanguage
    );
    if (defaultTracks.length) {
        for (let i = 0; i < defaultTracks.length; i++) {
            if (defaultTracks[i].srclang === "en") {
                foreignSubtitles = defaultTracks[i];
                foreignLanguage = "en";
                break;
            }
        }
        if (!foreignSubtitles) {
            for (let i = 0; i < defaultTracks.length; i++) {
                for (let j = 0; j < courseraTracks.languages.length; j++) {
                    if (
                        defaultTracks[i].srclang === courseraTracks.languages[j]
                    ) {
                        foreignSubtitles = defaultTracks[i];
                        foreignLanguage = courseraTracks.languages[j];
                    }
                }
            }
        }
        for (let i = 0; i < defaultTracks.length; i++) {
            if (defaultTracks[i].srclang === motherLanguage) {
                motherSubtitles = defaultTracks[i];
            }
        }
        if (foreignSubtitles && !motherSubtitles) {
            foreignSubtitles.track.mode = "showing";
            if (!motherSubtitles) {
                if (!bilingualSubtitle && !subtitleStatus) {
                    subtitleStatus = true;
                    await sleep(500);
                    let cues = foreignSubtitles.track.cues;
                    const cuesTextList = getCuesTextList(cues);
                    for (let i = 0; i < cuesTextList.length; i++) {
                        getTranslation(cuesTextList[i][1], (translatedText) => {
                            const translatedTextList =
                                translatedText.split("\n\n");
                            for (
                                let j = 0;
                                j < translatedTextList.length;
                                j++
                            ) {
                                cues[cuesTextList[i][0] + j].text =
                                    translatedTextList[j];
                            }
                        });
                    }
                } else if (!subtitleStatus) {
                    subtitleStatus = true;
                    await sleep(500);
                    let cues = foreignSubtitles.track.cues;
                    const cuesTextList = getCuesTextList(cues);
                    for (let i = 0; i < cuesTextList.length; i++) {
                        getTranslation(cuesTextList[i][1], (translatedText) => {
                            const translatedTextList =
                                translatedText.split("\n\n");
                            for (
                                let j = 0;
                                j < translatedTextList.length;
                                j++
                            ) {
                                cues[cuesTextList[i][0] + j].text +=
                                    "\n" + translatedTextList[j];
                            }
                        });
                    }
                }
            }
        } else {
            motherSubtitles.track.mode = "showing";
        }
    }
}

function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

function getCuesTextList(cues) {
    let cuesTextList = [];
    for (let i = 0; i < cues.length; i++) {
        if (
            cuesTextList.length &&
            cuesTextList[cuesTextList.length - 1][1].length +
                cues[i].text.length <
                5000
        ) {
            cuesTextList[cuesTextList.length - 1][1] += "\n\n" + cues[i].text;
        } else {
            cuesTextList.push([i, cues[i].text]);
        }
    }
    return cuesTextList;
}

function getTranslation(words, callback) {
    const xhr = new XMLHttpRequest();
    let url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${foreignLanguage}&tl=${motherLanguage}&dt=t&q=${encodeURI(
        words
    )}`;
    xhr.open("GET", url, true);
    xhr.responseType = "text";
    xhr.onload = function () {
        if (xhr.readyState === xhr.DONE) {
            if (xhr.status === 200 || xhr.status === 304) {
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

chrome.runtime.onMessage.addListener(function (request, sender) {
    openSubtitle();
});
