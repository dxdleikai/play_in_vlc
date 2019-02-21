'use strict';

var dom = {};

dom.$ = function(id, value, method = id => document.getElementById(id)) {
  const e = method(id);

  if (value) {
    Object.defineProperty(e, 'value', {
      get() {
        return e[value];
      },
      set(val) {
        e[value] = val;
      }
    });
  }

  return Object.assign(e, {
    on: function(name, callback) {
      name.split(/,\s*/).forEach(name => e.addEventListener(name, callback));
      return this;
    }
  });
};
dom.$$ = (query, value) => dom.$(query, value, query => document.querySelector(query));

dom.template = query => {
  const tempate = document.querySelector(query);
  return document.importNode(tempate.content, true);
};

dom.storage = {
  get: prefs => Object.entries(prefs).reduce((p, [key, value]) => {
    p[key] = localStorage.getItem(key) || value;
    return p;
  }, {}),
  set: prefs => {
    Object.entries(prefs).forEach(([key, value]) => localStorage.setItem(key, value));
  }
};

dom.on = function(name, callback) {
  if (name === 'load') {
    document.addEventListener('DOMContentLoaded', callback);
  }
};
