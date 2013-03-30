###
 Backbone memoryStorage Adapter
 Version 1.0

 https://github.com/yoshi6jp/Backbone.memoryStorage
###
class Backbone.MemoryStorage extends Backbone.LocalStorage
  storage: {}
  localStorage: ->
    @
  setItem: (key,val)->
    @storage[key] = val
  getItem: (key)->
    @storage[key]
  removeItem: (key)->
    delete @storage[key]
  clear: ->
    @storage = {}
  _storageSize: ->
    _.size @storage