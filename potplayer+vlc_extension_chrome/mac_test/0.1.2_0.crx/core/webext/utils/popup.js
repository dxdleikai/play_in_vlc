'use strict';

var popup = {};

popup.post = message => new Promise(resolve => chrome.runtime.sendMessage(message, resolve));

popup.background = () => new Promise(resolve => chrome.runtime.getBackgroundPage(resolve));

popup.notify = async(message) => {
  const bg = await popup.background();
  bg.webext.notifications.create({message});
};
