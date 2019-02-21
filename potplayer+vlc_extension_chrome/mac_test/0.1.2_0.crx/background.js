/* globals webext, send, clipboard */
'use strict';

const {runtime, browserAction, notifications, contextMenus} = webext;

// send counts to the top frame
runtime.on('message', ({count}, {tab, frameId}) => {
  webext.tabs.sendMessage(tab.id, {
    method: 'frame-count',
    count,
    frameId
  }, {
    frameId: 0
  });
}).if(({method}) => method === 'frame-count');

// update toolbar badge counter
var tab;
runtime.on('message', ({count}, {tab}) => browserAction.setBadgeText({
  text: count ? String(count) : '',
  tabId: tab.id
})).if(({method}) => method === 'update-badge');

var collect = async tab => {
  console.log(tab);
  const lists = await webext.tabs.execute.script(tab.id, {
    code: 'window.list',
    runAt: 'document_start',
    matchAboutBlank: true,
    allFrames: true
  });
  const urls = [].concat.apply([], lists)
    .filter(o => o)
    .map(o => o.url)
    .filter((s, i, l) => s && l.indexOf(s) === i);
  if (urls.length === 0) {
    urls.push(tab.url);
  }
  return urls;
};

//  send to VLC on user-action
browserAction.on('clicked', async tab => {
  try {
    const urls = await collect(tab);
    send(urls);
  }
  catch (e) {
    notifications.create({
      message: e.message
    });
  }
});

chrome.runtime.onMessage.addListener(
  async (request, sender, sendResponse) =>  {
    if (request.greeting == "hello") {
      try {
        const urls = await collect(sender.tab);
        send(urls);
      } catch (e) {
        notifications.create({
          message: e.message
        });
      }
    }
  });

runtime.on('start-up', () => {
  // copy to clipboard
  contextMenus.create({
    title: 'Copy detected links to the clipboard',
    contexts: ['browser_action'],
    id: 'copy-to-clipboard',
    documentUrlPatterns: ['*://*/*']
  });
  // play links
  contextMenus.create({
    title: 'Play in VLC',
    contexts: ['video', 'audio'],
    id: 'play-in-vlc',
    documentUrlPatterns: ['*://*/*'],
    targetUrlPatterns: [localStorage.getItem('targetUrlPatterns') || '*://*/*']
  });
});
contextMenus.on('clicked', async(info, tab) => {
  try {
    const urls = await collect(tab);
    clipboard.write(urls.join('\n'), tab.id, urls.length + ' link(s) copied to the clipboard');
  }
  catch (e) {
    notifications.create({
      message: e.message
    });
  }
}).if(({menuItemId}) => menuItemId === 'copy-to-clipboard');
// send to vlc from context-menu
contextMenus.on('clicked', ({srcUrl}) => send([srcUrl]))
  .if(({menuItemId}) => menuItemId === 'play-in-vlc');
