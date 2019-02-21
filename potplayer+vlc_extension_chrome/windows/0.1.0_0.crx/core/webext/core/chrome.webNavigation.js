/* globals webext, EventEmitter */
'use strict';

/*
  webext.webNavigation
  Events: committed
*/
{
  const onCommitted = details => webext.webNavigation.emit('committed', details);

  webext.webNavigation = new EventEmitter({
    committed: {
      first: () => chrome.webNavigation.onCommitted.addListener(onCommitted),
      last: () => chrome.webNavigation.onCommitted.removeListener(onCommitted)
    }
  }, chrome.webNavigation);
}
