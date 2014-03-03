'use strict';

describeMixin('lib/with_ajax', function () {
  var eventName = 'Locations',
      startedFetchSpy,
      endedFetchSpy,
      startedSubmitSpy,
      endedSubmitSpy,
      successSpy,
      failSpy;

  var ajaxSuccess = {
    status: 200,
    type: 'application/json',
    responseText: '{"status": "ok"}'
  };
  var ajaxFail = {
    status: 403,
    type: 'application/json',
    responseText: '{"status": "validation_error"}'
  };

  beforeEach(function () {
    setupComponent();
    jasmine.Ajax.useMock();

    startedFetchSpy = spyOnEvent(document, 'fetch'+ eventName +'Start');
    endedFetchSpy = spyOnEvent(document, 'fetch'+ eventName +'End');
    startedSubmitSpy = spyOnEvent(document, 'submit'+ eventName +'Start');
    endedSubmitSpy = spyOnEvent(document, 'submit'+ eventName +'End');
    successSpy = spyOnEvent(document, 'data'+ eventName);
    failSpy = spyOnEvent(document, 'data'+ eventName +'Error');
  });

  it('should require an eventName for options', function() {
    var catched = false;
    try {
      this.component.ajax('/m000/');
    } catch(e) {
      if(e === 'NoEventNameError') {
        catched = true;
      } else {
        console.log(e);
      }
    }

    expect(catched).toBe(true);
  });

  describe('.ajax request', function() {
    function _ajax(that, fail, ajaxOptions, opts) {
      var options = opts || {};
      options.eventName = options.eventName || eventName;
      that.component.ajax('/ajax', ajaxOptions, options);

      var request = mostRecentAjaxRequest();
      request.response(fail ? ajaxFail : ajaxSuccess);

      return request;
    }

    it('should trigger custom success event from eventName option', function() {
      _ajax(this);

      expect(successSpy.callCount).toBe(1);
    });

    it('should trigger custom fail event from eventName option', function() {
      _ajax(this, true);

      expect(failSpy.callCount).toBe(1);
    });

    it('should have enough data in fail event to redo request', function() {
      _ajax(this, true);

      expect(failSpy.callCount).toBe(1);
      expect(failSpy.mostRecentCall.data).toEqual({
        url: '/ajax',
        ajaxOptions: undefined,
        options: {eventName: 'Locations'},
        status: 403,
        statusText: 'error',
        response: {status : 'validation_error'}
      });
    });
  });

  describe('.get request', function() {
    function _get(that, fail, data) {
      that.component.get('/m000', eventName, data);

      var request = mostRecentAjaxRequest();
      request.response(fail ? ajaxFail : ajaxSuccess);

      return request;
    }

    it('should allow for ajaxOptions last', function() {
      var request = _get(this, false, {page: 2});

      expect(successSpy.callCount).toBe(1);
      expect(request.url).toMatch(/\?page=2$/);
    });
  });

  describe('.post request', function() {
    function _post(that, fail, options) {
      that.component.post('/submit', {greeting: 'Hello world!'}, eventName);

      var request = mostRecentAjaxRequest();
      request.response(fail ? ajaxFail : ajaxSuccess);

      return request;
    }

    it('should trigger submit events', function() {
      _post(this);

      expect(startedSubmitSpy.callCount).toBe(1);
      expect(endedSubmitSpy.callCount).toBe(1);
    });
  });

});
