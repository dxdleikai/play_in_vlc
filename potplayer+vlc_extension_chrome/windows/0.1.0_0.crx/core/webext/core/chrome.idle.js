/* globals webext, EventEmitter */
'use strict';

/*
  webext.contextMenus
  Events: changed
*/
{
  const callback = state => webext.idle.emit('changed', state);

  webext.idle = new EventEmitter({
    changed: {
      first: () => chrome.idle.onStateChanged.addListener(callback),
      last: () => chrome.idle.onStateChanged.removeListener(callback)
    }
  }, chrome.idle);
}
