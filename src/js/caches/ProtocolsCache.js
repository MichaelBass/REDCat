(function() {
  'use strict';

  function Protocols(cache) {
    this.KEY = 'protocols';

    cache.delegate(this, 'persist');
    cache.delegate(this, 'persistItem');
    cache.delegate(this, 'fetch');
    cache.delegate(this, 'fetchAll');
    cache.delegate(this, 'destroyItem');
    cache.delegate(this, 'destroyAll');

  }

  function ProtocolsCache(resourceCache) {
    return new Protocols(resourceCache);
  }

  angular.module('redcat.services')
         .factory('protocolsCache', ['resourceCache', ProtocolsCache]);
})();
