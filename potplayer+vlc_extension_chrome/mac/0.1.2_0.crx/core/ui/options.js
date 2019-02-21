/* globals dom, webext */
'use strict';
// set title for option page
document.title = 'Options :: ' + chrome.runtime.getManifest().name;
// reset
var toast = dom.$('toast', 'textContent');
toast.show = message => {
  toast.value = message;
  window.clearTimeout(toast.timer);
  toast.timer = window.setTimeout(() => toast.value = '', 750);
};

dom.$('reset').on('click', e => {
  if (e.detail === 1) {
    window.setTimeout(() => toast.value = '', 750);
    toast.show('Double-click to reset!');
  }
  else {
    localStorage.clear();
    chrome.storage.local.clear(() => {
      chrome.runtime.reload();
      window.close();
    });
  }
});
// support
dom.$('support').on('click', () => chrome.tabs.create({
  url: chrome.runtime.getManifest().homepage_url + '?rd=donate'
}));
// build synced and asynced prefs
var build = async({storage, description, type = 'sync', value = true}) => {
  const clone = dom.template('#tr-sample');
  clone.querySelector('tr').dataset.storage = true;
  clone.querySelector('tr').dataset.type = type;
  const input = clone.querySelector('input[type=checkbox]');
  input.id = storage;

  if (type === 'sync') {
    input.checked = dom.storage.get({
      [storage]: 'allow'
    })[storage] !== 'deny';
  }
  else {
    input.checked = (await webext.storage.get({
      [storage]: value
    }))[storage];
  }
  clone.querySelector('label').textContent = description;
  clone.querySelector('label').setAttribute('for', storage);

  dom.$('table').appendChild(clone);
};
// load
window.addEventListener('load', () => webext.policy.collect().forEach(build));
// save prefs
dom.$('save').on('click', async() => {
  dom.storage.set([...document.querySelectorAll('[data-storage][data-type=sync]')].reduce((p, tr) => {
    const input = tr.querySelector('input[type=checkbox]');
    p[input.id] = input.checked ? 'allow' : 'deny';
    return p;
  }, {}));
  await webext.storage.set([...document.querySelectorAll('[data-storage][data-type=async]')].reduce((p, tr) => {
    const input = tr.querySelector('input[type=checkbox]');
    p[input.id] = input.checked;
    return p;
  }, {}));

  if (dom.saved) {
    dom.saved();
  }
});
