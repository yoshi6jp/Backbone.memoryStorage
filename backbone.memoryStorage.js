
/*
 Backbone memoryStorage Adapter
 Version 1.0

 https://github.com/yoshi6jp/Backbone.memoryStorage
*/


(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Backbone.MemoryStorage = (function(_super) {

    __extends(MemoryStorage, _super);

    function MemoryStorage() {
      return MemoryStorage.__super__.constructor.apply(this, arguments);
    }

    MemoryStorage.prototype.storage = {};

    MemoryStorage.prototype.localStorage = function() {
      return this;
    };

    MemoryStorage.prototype.setItem = function(key, val) {
      return this.storage[key] = val;
    };

    MemoryStorage.prototype.getItem = function(key) {
      return this.storage[key];
    };

    MemoryStorage.prototype.removeItem = function(key) {
      return delete this.storage[key];
    };

    MemoryStorage.prototype.clear = function() {
      return this.storage = {};
    };

    MemoryStorage.prototype._storageSize = function() {
      return _.size(this.storage);
    };

    return MemoryStorage;

  })(Backbone.LocalStorage);

}).call(this);
