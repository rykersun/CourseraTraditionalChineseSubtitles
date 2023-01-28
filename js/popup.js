document.addEventListener(
    "DOMContentLoaded",
    function () {
        var checkButton = document.getElementById("translateBtn");
        checkButton.addEventListener(
            "click",
            function () {
                chrome.tabs.query(
                    { active: true, currentWindow: true },
                    function (tabs) {
                        chrome.tabs.sendMessage(tabs[0].id, {});
                    }
                );
            },
            false
        );
    },
    false
);
