/* globals webext */
'use strict';

// FAQs and Feedback
webext.runtime.on('start-up', async() => {
  const {name, version, homepage_url} = webext.runtime.getManifest(); // eslint-disable-line camelcase
  const page = homepage_url; // eslint-disable-line camelcase

  // Feedback
  webext.runtime.setUninstallURL(
    page + '?rd=feedback&name=' + name + '&version=' + version
  );
  // FAQs
  const prefs = await webext.storage.get({
    'version': null,
    'faqs': navigator.userAgent.indexOf('Firefox') === -1,
    'last-update': 0,
  });
  if (prefs.version ? (prefs.faqs && prefs.version !== version) : true) {
    const now = Date.now();
    const doUpdate = (now - prefs['last-update']) / 1000 / 60 / 60 / 24 > 30;
    await webext.storage.set({
      version,
      'last-update': doUpdate ? Date.now() : prefs['last-update']
    });
    // do not display the FAQs page if last-update occurred less than 30 days ago.
    if (doUpdate) {
      const p = Boolean(prefs.version);
      window.setTimeout(() => webext.tabs.create({
        url: page + '?version=' + version +
          '&name=' + encodeURIComponent(name) +
          '&type=' + (p ? ('upgrade&p=' + prefs.version) : 'install'),
        active: p === false
      }), 2000);
    }
  }
});
