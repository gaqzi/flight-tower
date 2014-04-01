define(function(require) {
  'use strict';
  var utils = require('flight/lib/utils');

  return bootstrapForm;

  function bootstrapForm() {

    this.attachBootstrapForm = function(options) {
      options = utils.push({
        toggleLoadingState: true,
        bootstrapFormSubmitSelector: '[type="submit"]',
        addErrorMessages: false,
        addErrorClass: true,
        errorKey: 'errors', // The object key that all errors are under
        errorClassParentSelector: false,
        errorClass: 'has-error'
      }, options);

      if(options.toggleLoadingState) {
        this.on('formSubmitStart', function() {
          this.select('bootstrapFormSubmitSelector')
            .button('loading');
        });

        this.on('formSubmitEnd', function() {
          this.select('bootstrapFormSubmitSelector')
            .button('reset');
        });
      }

      function _iterateErrors(that, errors, cb) {
        for(var name in errors) {
          var input = that.$node.find('[name="'+ name +'"]');
          cb(input, errors[name]);
        }
      }

      if(options.addErrorClass) {
        this.on('formSubmitError', function(e, data) {
          _iterateErrors(
            this, data.response[options.errorKey], function(input) {
              if(options.errorClassParentSelector) {
                input = input.parents(options.errorClassParentSelector);
              } else {
                input = input.parent();
              }

              input.addClass(options.errorClass);
            }
          );
        });
      }

      if(options.addErrorMessages) {
        this.on('formSubmitError', function(e, data) {
          _iterateErrors(
            this, data.response[options.errorKey], function(input, message) {
              input.parent().append(
                '<span class="help-block text-error">' +
                  message + '</span>'
              );
            }
          );
        });
      }
    };
  }
});
