'use strict';

function debounce(func, wait) {
  let time = 0;
  const context = this;

  return function() {
    const now = Date.now();
    if (now - time > wait) {
      func.apply(context, arguments);
      time = now;
    }
  };
}
