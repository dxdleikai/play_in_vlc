/* globals webext */
'use strict';

var clipboard = {};
{
  const isFirefox = true;
  const notify = message => webext.notifications.create({
    message
  });
  //const isFirefox = /Firefox/.test(navigator.userAgent);
  const storage = {};

  if (isFirefox) {
    webext.runtime.on('message', ({id}, sender, response) => {
      response(storage[id]);
      // multiple requests may need this value
      window.setTimeout(() => delete storage[id], 2000);
    }).if(request => request.method === 'clipboard-data');
  }

  clipboard.write = async(str, tabId, message = 'Copied to the clipboard') => {
    if (isFirefox) {
      const id = Math.random();
      storage[id] = str;

      const run = tabId => chrome.tabs.executeScript(tabId, {
        allFrames: false,
        runAt: 'document_start',
        code: `
          chrome.runtime.sendMessage({
            method: 'clipboard-data',
            id: ${id}
          }, str => {
            console.log(str);
            document.oncopy = e => {
              e.clipboardData.setData('text/plain', str);
              e.preventDefault();
            };
            window.focus();
            document.execCommand('Copy', false, null);
          });
        `
      }, () => {
        notify(chrome.runtime.lastError ? 'Cannot copy to the clipboard on this page!' : message);
      });
      if (tabId) {
        run(tabId);
      }
      else {
        const tab = await webext.tabs.current();
        if (tab) {
          run(tab.id);
        }
        else {
          notify('Cannot copy on this browser tab');
        }
      }
    }
    else {
      document.oncopy = e => {
        e.clipboardData.setData('text/plain', str);
        e.preventDefault();
        notify(message);
      };
      document.execCommand('Copy', false, null);
    }
  };
}
