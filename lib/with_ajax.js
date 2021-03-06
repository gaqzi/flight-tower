define(function(require) {
  'use strict';
  return withAjax;

  function withAjax() {
    /**
     * To consistently send the same events in all ajax requests to the server.
     *
     * For an `eventName` "Locations" will trigger these events during
     * its lifecycle:
     * - fetchLocationsStarted: triggered just before the ajax connection
     * - fetchLocationsEnd: triggered whenever the ajax connection finished
     * - dataLocations: on success
     * - dataLocationsError: on error fetching
     *
     * The lifecycle events of the ajax call will be named
     * `fetchEventStarted` for GET and HEAD requests and
     * `submitEventStarted` for POST, PUT, PATCH.
     *
     * Options:
     *   eventName: the basic name of the event Capitalized.
     *   lifeCycleNames: an object with keys `fetch` and `submit` for
     *                   getting or sending data to the server.
     *
     * @param {String} url the path to the server
     * @param {Object} ajaxOptions passed directly onto $.ajax
     * @param {Object} options options for this mixin
     */
    this.ajax = function(url, ajaxOptions, options) {
      var that = this,
          eventName = options instanceof Object ? options.eventName : options,
          method = ajaxOptions ? ajaxOptions.method || 'get' : 'get',
          prefix = ['get', 'head'].indexOf(method.toLowerCase()) > -1 ? 'fetch' : 'submit';

      if(!eventName) {
        throw 'NoEventNameError';
      }

      this.trigger(prefix + eventName +'Start');

      return $.ajax(url, ajaxOptions)
        .always(function() {
          that.trigger(prefix + eventName +'End');
        })
        .done(function(data) {
          that.trigger('data'+ eventName, data);
        })
        .fail(function(err) {
          that.trigger('data'+ eventName +'Error', {
            url: url,
            ajaxOptions: ajaxOptions,
            options: options,
            status: err.status,
            statusText: err.statusText,
            response: err.responseJSON || err.responseText
          });
        });
    };

    this.get = function(url, eventName, data) {
      return this.ajax(url, data ? {data: data} : undefined, eventName);
    };

    this.post = function(url, data, eventName) {
      var ajaxOptions = {
        data: data ? data : undefined,
        method: 'post'
      };
      return this.ajax(url, ajaxOptions, eventName);
    };
  }
});
