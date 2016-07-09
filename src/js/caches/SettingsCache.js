(function() {
  'use strict';

  function Settings(cache) {
    this.KEY = 'settings';

    cache.delegate(this, 'persist');
    cache.delegate(this, 'persistItem');
    cache.delegate(this, 'first');
    cache.delegate(this, 'fetchAllDirty');
    cache.delegate(this, 'markClean');

  }

  function SettingsCache(resourceCache) {
    return new Settings(resourceCache);
  }

  angular.module('redcat.services')
         .factory('settingsCache', ['resourceCache', SettingsCache]);
})();
