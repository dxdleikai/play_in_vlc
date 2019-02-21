/* globals webext, EventEmitter */
'use strict';

/*
  webext.downloads
  Events: changed
*/
{
  const onCreated = item => webext.downloads.emit('created', item);
  const onErased = item => webext.downloads.emit('erased', item);
  const onChanged = item => webext.downloads.emit('changed', item);

  webext.downloads = new EventEmitter({
    created: {
      first: () => chrome.downloads.onCreated.addListener(onCreated),
      last: () => chrome.downloads.onCreated.removeListener(onCreated)
    },
    erased: {
      first: () => chrome.downloads.onErased.addListener(onErased),
      last: () => chrome.downloads.onErased.removeListener(onErased)
    },
    changed: {
      first: () => chrome.downloads.onChanged.addListener(onChanged),
      last: () => chrome.downloads.onChanged.removeListener(onChanged)
    },
  }, chrome.downloads);
}
