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
});