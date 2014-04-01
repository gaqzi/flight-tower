define(function(require) {
  'use strict';
  var defineComponent = require('flight/lib/component'),
      compose = require('flight/lib/compose'),
      withAjax = require('./with_ajax');

  return defineComponent(formSubmission, withAjax);

  /**
   * Attaches to a form and triggers form specific events on top of
   * the .ajax events.
   *
   * Form events:
   * - formSubmitStart
   * - formSubmitEnd
   * - formSubmitSuccess
   * - formSubmitError
   *
   * Optional if resetFormOnSuccess is used:
   * - uiFormCleared
   *
   * Usage with for instance the withBootstrapForm mixin:
   *
   * formSubmission.attachTo('.js-search-form', {
   *   resetFormOnSuccess: false,
   *   mixins: [
   *     { object: withBootstrapForm, initialize: 'attachBootstrapForm',
   *       options: {addErrorMessage: true, addErrorClass: true} }
   *   ]
   * });
   */
  function formSubmission() {
    this.defaultAttrs({
      submitEventName: 'Form',
      resetFormOnSuccess: true,
      mixins: []
    });

    this.submitHandler = function(e, data) {
      e.preventDefault();

      var url = this.$node.attr('action'),
          method = this.$node.attr('method');

      this.ajax(url, {
        method: method,
        data: this.$node.serialize()
      }, this.attr.submitEventName);
    };

    this.after('initialize', function() {
      // The name used by .ajax to create events
      var eventName = this.attr.submitEventName;

      // Normalize the events to be about the form and not the XHR request
      this.on('submit'+ eventName +'Start', 'formSubmitStart');
      this.on('submit'+ eventName +'End', 'formSubmitEnd');
      this.on('fetch'+ eventName +'Start', 'formSubmitStart');
      this.on('fetch'+ eventName +'End', 'formSubmitEnd');
      this.on('data'+ eventName, 'formSubmitSuccess');
      this.on('data'+ eventName +'Error', 'formSubmitError');

      this.on('submit', this.submitHandler);

      if(this.attr.resetFormOnSuccess) {
        this.on('formSubmitSuccess', function(e) {
          this.node.reset();
          this.trigger('uiFormCleared');
        });
      }

      // Dynamically add in mixins
      if(this.attr.mixins.length > 0) {
        for(var i=0, mixin;(mixin = this.attr.mixins[i++]);) {
          compose.mixin(this, [mixin.object]);
          this[mixin.initialize](mixin.options);
        }
      }
    });
  }
});
