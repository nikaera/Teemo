/* global chrome */

let vid = -1;
const w = 450; // ウィンドウ幅を拡大
const h = 300; // ウィンドウ高さを拡大
const pickerHeight = 300;
const suggestionHeight = 100;

// Service Worker では screen オブジェクトは使えないため、chrome.system.display.getInfo で中央配置
function getCenterPosition(width, height, callback) {
  if (!chrome.system || !chrome.system.display) {
    // fallback: 画面左上
    callback(100, 100);
    return;
  }
  chrome.system.display.getInfo(function (displays) {
    // プライマリディスプレイを探す
    const primary = displays.find((d) => d.isPrimary) || displays[0];
    const left = Math.round(
      primary.bounds.left + (primary.bounds.width - width) / 2,
    );
    const top = Math.round(
      primary.bounds.top + (primary.bounds.height - height) / 2,
    );
    callback(left, top);
  });
}

chrome.action.onClicked.addListener(() => {
  chrome.windows.get(vid, function (chromeWindow) {
    if (!chrome.runtime.lastError && chromeWindow) {
      chrome.windows.update(vid, { focused: true });
      return;
    }
    getCenterPosition(w, h, (left, top) => {
      chrome.windows.create(
        {
          url: "index.html",
          type: "popup",
          width: w,
          height: h,
          left: left,
          top: top,
        },
        function (window) {
          vid = window.id;
        },
      );
    });
  });
});

chrome.runtime.onMessage.addListener(function (request) {
  if (request && request.action === "resizeWindow") {
    chrome.windows.getCurrent(function (window) {
      // 生成したウィンドウ（vid）以外はリサイズしない
      if (window.id !== vid) {
        return;
      }
      if (request.data.isShowPicker) {
        chrome.windows.update(window.id, {
          width: w,
          height: h + pickerHeight,
        });
      } else if (request.data.isSuggesting) {
        chrome.windows.update(window.id, {
          width: w,
          height: h + suggestionHeight,
        });
      } else {
        chrome.windows.update(window.id, {
          width: w,
          height: h,
        });
      }
    });
  }
});
