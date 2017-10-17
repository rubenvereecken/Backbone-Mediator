describe("Validation system", function () {
  
  beforeEach(function() {
    Backbone.Mediator.init();
  });
  
  it("emits a warning when you publish on an undefined channel", function() {
    spyOn(console, 'warn');
    Backbone.Mediator.subscribe('1', function(e) {});
    expect(console.warn).toHaveBeenCalled();
  });
  
  it("blocks publications that do not follow a defined schema", function() {
    obj = {};
    obj.func = function () {};
    spyOn(obj, 'func');
    Backbone.Mediator.subscribe('1', obj.func);
    Backbone.Mediator.addChannelSchema('1', { type: 'string' });
    Backbone.Mediator.publish('1', 5);
    expect(obj.func).not.toHaveBeenCalled();
  });

  it("emits an error when a publication has been blocked", function() {
    spyOn(console, 'error');
    Backbone.Mediator.addChannelSchema('1', { type: 'string' });
    Backbone.Mediator.publish('1', 5);
    expect(console.error).toHaveBeenCalled();
  });
  
  it("allows publications which validate with the schema", function() {
    obj = {};
    obj.func = function () {};
    spyOn(obj, 'func');
    Backbone.Mediator.subscribe('1', obj.func);
    Backbone.Mediator.addChannelSchema('1', { type: 'string' });
    Backbone.Mediator.publish('1', 'string');
    expect(obj.func).toHaveBeenCalled();
  });

  it("publishes to every subscriber, even when some subscribers are removed in the middle", function() {
    var context = {};
    var func4Called = false;
    var func1 = function () { console.log('func 1'); }
    var func2 = function () {
      console.log('func 2 (once)');
    }
    var func3 = function () {
      console.log('func 3 (unsubscribe)');
      Backbone.Mediator.unsubscribe('channel', func3, context);
    }
    var func4 = function () {
      console.log('func 4 (normal)');
      func4Called = true;
    }
    Backbone.Mediator.subscribe('channel', func1, context);
    Backbone.Mediator.subscribeOnce('channel', func2, context);
    Backbone.Mediator.subscribe('channel', func3, context);
    Backbone.Mediator.subscribe('channel', func4, context);
    Backbone.Mediator.publish('channel');
    expect(func4Called).toBe(true);
  })
});
