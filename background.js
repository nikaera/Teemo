let vid = -1;
chrome.browserAction.onClicked.addListener(function () {
  var w = 380;
  var h = 180;
  var pickerHeight = 405;
  var suggestionHeight = 100;
  var left = screen.width / 2 - w / 2;
  var top = screen.height / 2 - h / 2;

  chrome.windows.get(vid, function (chromeWindow) {
    if (!chrome.runtime.lastError && chromeWindow) {
      chrome.windows.update(vid, { focused: true });
      return;
    }
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
      }
    );
  });

  chrome.runtime.onMessage.addListener(function (
    request,
    sender,
    sendResponse
  ) {
    if (request && request.action === "resizeWindow") {
      chrome.windows.getCurrent(function (window) {
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
});
