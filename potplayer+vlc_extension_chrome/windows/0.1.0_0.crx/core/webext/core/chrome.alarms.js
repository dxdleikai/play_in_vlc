/* globals webext, EventEmitter */
'use strict';

/*
  webext.contextMenus
  Events: alarm
*/
{
  const callback = alarm => webext.alarms.emit('alarm', alarm);

  webext.alarms = new EventEmitter({
    alarm: {
      first: () => chrome.alarms.onAlarm.addListener(callback),
      last: () => chrome.alarms.onAlarm.removeListener(callback)
    }
  }, chrome.alarms);

  webext.alarms.create = (name, alarmInfo) => chrome.alarms.clear(name, () => chrome.alarms.create(name, alarmInfo));
}
