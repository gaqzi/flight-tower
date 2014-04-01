'use strict';

describeComponent('lib/form_submission', function () {
  var eventName = 'Form',
      formSubmitStartSpy,
      formSubmitEndSpy,
      formSubmitSuccessSpy,
      formSubmitErrorSpy;

  var ajaxSuccess = {
    status: 200,
    type: 'application/json',
    responseText: '{"status": "ok"}'
  }, ajaxFail = {
    status: 403,
    type: 'application/json',
    responseText: '{"status": "validation_error"}'
  }, formFixture = readFixtures('form.html');

  // Initialize the component and attach it to the DOM
  beforeEach(function () {
    setupComponent(formFixture);
    jasmine.Ajax.useMock();

    formSubmitStartSpy = spyOnEvent(document, 'formSubmitStart');
    formSubmitEndSpy = spyOnEvent(document, 'formSubmitEnd');
    formSubmitSuccessSpy = spyOnEvent(document, 'formSubmitSuccess');
    formSubmitErrorSpy = spyOnEvent(document, 'formSubmitError');
  });

  function _submit(that, isFailure) {
    that.$node.submit();
    var request = mostRecentAjaxRequest();
    request.response(isFailure ? ajaxFail : ajaxSuccess);

    return request;
  }

  describe('submit triggers lifecycle events', function() {
    it('should trigger on post form', function() {
      _submit(this);

      expect(formSubmitStartSpy.callCount).toBe(1);
      expect(formSubmitEndSpy.callCount).toBe(1);
    });

    it('should trigger on get form', function() {
      this.$node.attr('method', 'get');
      _submit(this);

      expect(formSubmitStartSpy.callCount).toBe(1);
      expect(formSubmitEndSpy.callCount).toBe(1);
    });

    it('should trigger formSubmitSuccess on success', function() {
      _submit(this);

      expect(formSubmitSuccessSpy.callCount).toBe(1);
    });

    it('should trigger formSubmitError on failure', function() {
      _submit(this, true);

      expect(formSubmitSuccessSpy.callCount).toBe(0);
      expect(formSubmitErrorSpy.callCount).toBe(1);
    });
  });

  describe('reset form on success option', function() {
    it('should reset when option is true', function() {
      this.$node.find('#input-username').val('hello');
      var event = spyOnEvent(document, 'uiFormCleared');
      _submit(this);

      expect(this.$node.find('#input-username').val()).toBe('');
      expect(event.callCount).toBe(1);
    });

    it('should not reset when option is false', function() {
      setupComponent(formFixture, {
        resetFormOnSuccess: false
      });

      this.$node.find('#input-username').val('hello');
      var event = spyOnEvent(document, 'uiformCleared');
      _submit(this);

      expect(this.$node.find('#input-username').val()).toBe('hello');
      expect(event.callCount).toBe(0);
    });
  });

  describe('should be able to dynamically mixin form mixins', function() {
    var withExampleForm;

    beforeEach(function() {
      withExampleForm = function() {
        this.attachExampleForm = function(options) {
          this.on('formSubmitStart', 'superExtraEvent');
        };
      };
    });

    it('should accept other mixins and attach them dynamically', function() {
      setupComponent(formFixture, {
        mixins: [
          { object: withExampleForm, initialize: 'attachExampleForm',
            options: false }
        ]
      });

      var event = spyOnEvent(document ,'superExtraEvent');
      _submit(this);

      expect(event.callCount).toBe(1);
    });
  });

});
