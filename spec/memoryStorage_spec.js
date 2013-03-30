(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  describe('backbone.memoryStorage', function() {
    var attributes, beforeLocalStorageLength, localStorageLength;
    localStorageLength = function() {
      if (window.localStorage != null) {
        return window.localStorage.length;
      } else {
        return 0;
      }
    };
    beforeLocalStorageLength = localStorageLength();
    attributes = {
      string: "String",
      string2: "String 2",
      number: 1337
    };
    describe('on a Collection', function() {
      var Collection, Model, collection;
      Model = (function(_super) {

        __extends(Model, _super);

        function Model() {
          return Model.__super__.constructor.apply(this, arguments);
        }

        Model.prototype.defaults = attributes;

        return Model;

      })(Backbone.Model);
      Collection = (function(_super) {

        __extends(Collection, _super);

        function Collection() {
          return Collection.__super__.constructor.apply(this, arguments);
        }

        Collection.prototype.model = Model;

        Collection.prototype.localStorage = new Backbone.MemoryStorage("collectionStore");

        return Collection;

      })(Backbone.Collection);
      collection = new Collection;
      beforeEach(function() {
        return collection.localStorage._clear();
      });
      beforeEach(function() {
        return collection.fetch();
      });
      it("should use `localSync`", function() {
        return expect(Backbone.getSyncMethod(collection)).toEqual(Backbone.localSync);
      });
      it("should initially be empty", function() {
        return expect(collection.length).toEqual(0);
      });
      describe("create", function() {
        var model;
        model = null;
        beforeEach(function() {
          return model = collection.create({});
        });
        it("should have 1 model", function() {
          return expect(collection.length).toEqual(1);
        });
        it("should have a populated model", function() {
          var withId;
          withId = _.clone(attributes);
          withId.id = model.id;
          return expect(model.toJSON()).toEqual(withId);
        });
        it("should have assigned an `id` to the model", function() {
          return expect(model.id).toBeDefined();
        });
        return it("should not change the length of the local storage", function() {
          return expect(localStorageLength()).toEqual(beforeLocalStorageLength);
        });
      });
      describe("get (by `id`)", function() {
        var model;
        model = null;
        beforeEach(function() {
          return model = collection.create({});
        });
        return it("should find the model with its `id`", function() {
          return expect(collection.get(model.id)).toEqual(model);
        });
      });
      return describe("instances", function() {
        describe("save", function() {
          var model, model2;
          model = null;
          model2 = null;
          beforeEach(function() {
            model = collection.create({});
            model.save({
              string: "String 0"
            });
            return collection.fetch();
          });
          it("should persist the changes", function() {
            return expect(model.get("string")).toEqual("String 0");
          });
          it("should not change the length of the local storage", function() {
            return expect(localStorageLength()).toEqual(beforeLocalStorageLength);
          });
          return describe("with a new `id`", function() {
            beforeEach(function() {
              model2 = collection.create({});
              model2.save({
                id: 1
              });
              return collection.fetch();
            });
            it("should have a new `id`", function() {
              return expect(model2.id).toEqual(1);
            });
            return it("should have kept its old properties", function() {
              var withId;
              withId = _.clone(attributes);
              withId.id = 1;
              return expect(model2.toJSON()).toEqual(withId);
            });
          });
        });
        describe("destroy", function() {
          var afterFetchLength, beforeFetchLength;
          beforeFetchLength = 0;
          afterFetchLength = 0;
          beforeEach(function() {
            return _(5).times(function() {
              return collection.create();
            });
          });
          beforeEach(function() {
            _.each(collection.toArray(), function(model) {
              return model.destroy();
            });
            return beforeFetchLength = collection.length;
          });
          beforeEach(function() {
            collection.fetch();
            return afterFetchLength = collection.length;
          });
          it("should have removed all items from the collection", function() {
            return expect(beforeFetchLength).toEqual(0);
          });
          it("should have removed all items from the store", function() {
            return expect(afterFetchLength).toEqual(0);
          });
          return it("should not change the length of the local storage", function() {
            return expect(localStorageLength()).toEqual(beforeLocalStorageLength);
          });
        });
        return describe("with a different `idAttribute`", function() {
          var Collection2, Model2, collection2;
          Model2 = (function(_super) {

            __extends(Model2, _super);

            function Model2() {
              return Model2.__super__.constructor.apply(this, arguments);
            }

            Model2.prototype.defaults = attributes;

            Model2.prototype.idAttribute = "_id";

            return Model2;

          })(Backbone.Model);
          Collection2 = (function(_super) {

            __extends(Collection2, _super);

            function Collection2() {
              return Collection2.__super__.constructor.apply(this, arguments);
            }

            Collection2.prototype.model = Model2;

            Collection2.prototype.localStorage = new Backbone.MemoryStorage("collection2Store");

            return Collection2;

          })(Backbone.Collection);
          collection2 = new Collection2;
          beforeEach(function() {
            return collection2.create();
          });
          return it("should have used the custom `idAttribute`", function() {
            return expect(collection2.first().id).toEqual(collection2.first().get("_id"));
          });
        });
      });
    });
    describe("on a Model", function() {
      var Model, model;
      Model = (function(_super) {

        __extends(Model, _super);

        function Model() {
          return Model.__super__.constructor.apply(this, arguments);
        }

        Model.prototype.defaults = attributes;

        Model.prototype.localStorage = new Backbone.MemoryStorage("modelStore");

        return Model;

      })(Backbone.Model);
      model = new Model;
      beforeEach(function() {
        return model.localStorage._clear();
      });
      it("should use `localSync`", function() {
        return expect(Backbone.getSyncMethod(model)).toEqual(Backbone.localSync);
      });
      describe("fetch", function() {
        it('should fire sync event on fetch', function() {
          var done;
          done = jasmine.createSpy("done");
          model = new Model(attributes);
          model.on('sync', done);
          model.fetch();
          return expect(done).toHaveBeenCalled();
        });
        return it("should not change the length of the local storage", function() {
          return expect(localStorageLength()).toEqual(beforeLocalStorageLength);
        });
      });
      describe("save", function() {
        beforeEach(function() {
          model.save();
          return model.fetch();
        });
        it("should be saved in the store", function() {
          return expect(model.id).toBeDefined();
        });
        it("should not change the length of the local storage", function() {
          return expect(localStorageLength()).toEqual(beforeLocalStorageLength);
        });
        describe("with new attributes", function() {
          beforeEach(function() {
            model.save({
              number: 42
            });
            return model.fetch();
          });
          return it("should persist the changes", function() {
            return expect(model.toJSON()).toEqual(_.extend(_.clone(attributes), {
              id: model.id,
              number: 42
            }));
          });
        });
        return describe('fires events', function() {
          var model3;
          model3 = null;
          beforeEach(function() {
            return model3 = new Model;
          });
          afterEach(function() {
            return model3.destroy();
          });
          return it('should fire sync event on save', function() {
            var done;
            done = jasmine.createSpy("done");
            model3.on('sync', function() {
              model3.off('sync');
              return done();
            });
            model3.save({
              foo: 'baz'
            });
            return expect(done).toHaveBeenCalled();
          });
        });
      });
      return describe("destroy", function() {
        beforeEach(function() {
          return model.destroy();
        });
        it("should have removed the instance from the store", function() {
          return expect(Model.prototype.localStorage.findAll().length).toEqual(0);
        });
        return it("should not change the length of the local storage", function() {
          return expect(localStorageLength()).toEqual(beforeLocalStorageLength);
        });
      });
    });
    return describe("Error handling", function() {
      var Model;
      return Model = (function(_super) {

        __extends(Model, _super);

        function Model() {
          return Model.__super__.constructor.apply(this, arguments);
        }

        Model.prototype.defaults = attributes;

        Model.prototype.localStorage = new Backbone.MemoryStorage("modelStore");

        return Model;

      })(Backbone.Model);
    });
  });

  describe("Without Backbone.localStorage", function() {
    describe("on a Collection", function() {
      var Collection, collection;
      Collection = (function(_super) {

        __extends(Collection, _super);

        function Collection() {
          return Collection.__super__.constructor.apply(this, arguments);
        }

        return Collection;

      })(Backbone.Collection);
      collection = new Collection;
      return it("should use `ajaxSync`", function() {
        return expect(Backbone.getSyncMethod(collection)).toEqual(Backbone.ajaxSync);
      });
    });
    return describe("on a Model", function() {
      var Model, model;
      Model = (function(_super) {

        __extends(Model, _super);

        function Model() {
          return Model.__super__.constructor.apply(this, arguments);
        }

        return Model;

      })(Backbone.Model);
      model = new Model;
      return it("should use `ajaxSync`", function() {
        return expect(Backbone.getSyncMethod(model)).toEqual(Backbone.ajaxSync);
      });
    });
  });

}).call(this);
