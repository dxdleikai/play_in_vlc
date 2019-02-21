/* globals webext */
'use strict';

webext.windows = Object.assign({}, chrome.windows);

webext.windows.create = createData => new Promise(resolve => chrome.windows.create(createData, resolve));
webext.windows.single = createData => {
  const url = createData.url.startsWith('http') ? createData.url : chrome.runtime.getURL(createData.url);
  chrome.tabs.query({
    url
  }, tabs => {
    if (tabs && tabs.length) {
      chrome.tabs.update(tabs[0].id, {
        active: true,
      });
      chrome.windows.update(tabs[0].windowId, {
        focused: true
      });
    }
    else {
      return webext.windows.create(createData);
    }
  });
};
