
# Backbone.MemoryStorage = Backbone.LocalStorage
describe 'backbone.memoryStorage', ->
  localStorageLength = ->
    if window.localStorage?
      window.localStorage.length
    else
      0

  beforeLocalStorageLength = localStorageLength()
  attributes =
    string: "String"
    string2: "String 2"
    number: 1337
  describe 'on a Collection', ->
    class Model extends Backbone.Model
      defaults: attributes

    class Collection extends Backbone.Collection
      model: Model
      localStorage: new Backbone.MemoryStorage "collectionStore"
    collection = new Collection
    # Clean up before starting
    beforeEach ->
      collection.localStorage._clear()

    beforeEach ->
      collection.fetch()

    it "should use `localSync`", ->
      expect(Backbone.getSyncMethod collection ).toEqual Backbone.localSync

    it "should initially be empty", ->
      expect(collection.length).toEqual 0

    describe "create", ->
      model = null

      beforeEach ->
        model = collection.create {}

      it "should have 1 model", ->
        expect(collection.length).toEqual 1

      it "should have a populated model", ->
        withId = _.clone attributes
        withId.id = model.id;
        expect(model.toJSON()).toEqual withId

      it "should have assigned an `id` to the model", ->
        expect(model.id).toBeDefined()

      it "should not change the length of the local storage", ->
        expect(localStorageLength()).toEqual beforeLocalStorageLength

    describe "get (by `id`)", ->
      model = null

      beforeEach ->
        model = collection.create {}

      it "should find the model with its `id`", ->
        expect(collection.get model.id ).toEqual model

    describe "instances", ->

      describe "save", ->
        model = null
        model2 = null

        beforeEach ->
          model = collection.create {}
          model.save string: "String 0"
          collection.fetch()

        it "should persist the changes", ->
          expect(model.get "string" ).toEqual "String 0"

        it "should not change the length of the local storage", ->
          expect(localStorageLength()).toEqual beforeLocalStorageLength

        describe "with a new `id`", ->

          beforeEach ->
            model2 = collection.create {}
            model2.save id: 1
            collection.fetch()

          it "should have a new `id`", ->
            expect(model2.id).toEqual 1

          it "should have kept its old properties", ->
            withId = _.clone attributes
            withId.id = 1
            expect(model2.toJSON()).toEqual withId

      describe "destroy", ->
        beforeFetchLength = 0
        afterFetchLength = 0

        beforeEach ->
          # Make sure there's at least items in there
          # ... can't rely on previous tests
          _(5).times ->
            collection.create()

        beforeEach ->
          _.each collection.toArray(), (model)->
            model.destroy()
          beforeFetchLength = collection.length

        beforeEach ->
          collection.fetch()
          afterFetchLength = collection.length

        it "should have removed all items from the collection", ->
          expect(beforeFetchLength).toEqual 0

        it "should have removed all items from the store", ->
          expect(afterFetchLength).toEqual 0

        it "should not change the length of the local storage", ->
          expect(localStorageLength()).toEqual beforeLocalStorageLength

      describe "with a different `idAttribute`", ->

        class Model2 extends Backbone.Model
          defaults: attributes
          idAttribute: "_id"

        class Collection2 extends Backbone.Collection
          model: Model2
          localStorage: new Backbone.MemoryStorage "collection2Store"

        collection2 = new Collection2

        beforeEach ->
          collection2.create()

        it "should have used the custom `idAttribute`", ->
          expect(collection2.first().id).toEqual collection2.first().get "_id"

  describe "on a Model", ->

    class Model extends Backbone.Model
      defaults: attributes
      localStorage: new Backbone.MemoryStorage "modelStore"

    model = new Model

    beforeEach ->
      model.localStorage._clear()

    it "should use `localSync`", ->
      expect(Backbone.getSyncMethod model).toEqual Backbone.localSync

    describe "fetch", ->
      it 'should fire sync event on fetch', ->
        done = jasmine.createSpy "done"
        model = new Model attributes
        model.on 'sync', done
        model.fetch()
        expect(done).toHaveBeenCalled()

      it "should not change the length of the local storage", ->
        expect(localStorageLength()).toEqual beforeLocalStorageLength

    describe "save", ->

      beforeEach ->
        model.save()
        model.fetch()

      it "should be saved in the store", ->
        expect(model.id).toBeDefined()

      it "should not change the length of the local storage", ->
        expect(localStorageLength()).toEqual beforeLocalStorageLength

      describe "with new attributes", ->

        beforeEach ->
          model.save number: 42
          model.fetch()

        it "should persist the changes", ->
          expect(model.toJSON()).toEqual _.extend _.clone(attributes), id: model.id, number: 42

      describe 'fires events', ->
        model3 = null
        beforeEach ->
          model3 = new Model
        afterEach ->
          model3.destroy()

        it 'should fire sync event on save', ->
          done = jasmine.createSpy "done"
          model3.on 'sync', ->
            model3.off 'sync'
            done()
          model3.save foo: 'baz'
          expect(done).toHaveBeenCalled()

    describe "destroy", ->
      beforeEach ->
        model.destroy()

      it "should have removed the instance from the store", ->
        expect(Model.prototype.localStorage.findAll().length).toEqual 0

      it "should not change the length of the local storage", ->
        expect(localStorageLength()).toEqual beforeLocalStorageLength

  describe "Error handling", ->

    class Model extends Backbone.Model
      defaults: attributes
      localStorage: new Backbone.MemoryStorage "modelStore"

describe "Without Backbone.localStorage", ->

  describe "on a Collection", ->
    class Collection extends Backbone.Collection
    collection = new Collection

    it "should use `ajaxSync`", ->
      expect(Backbone.getSyncMethod collection ).toEqual Backbone.ajaxSync

  describe "on a Model", ->
    class Model extends  Backbone.Model
    model = new Model

    it "should use `ajaxSync`", ->
      expect(Backbone.getSyncMethod model).toEqual Backbone.ajaxSync
