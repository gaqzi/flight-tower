'use strict';

describeMixin('lib/with_bootstrap_form', function () {
  beforeEach(function() {
    setupComponent(readFixtures('form.html'));
  });

  function _triggerError(that, errorKey) {
    var data = { response: {} };
    errorKey = errorKey || 'errors';
    data.response[errorKey] = { username: 'This user does not exist' };

    that.component.trigger('formSubmitError', data);
  }

  describe('toggleLoadingState option', function() {
    var button = false;
    beforeEach(function() {
      button = false;
      $.fn.button = function(arg) {
        if(this.size() > 0) {
          button = arg;
        }
      };
    });

    it('should trigger .button("loading") when submitting form', function() {
      this.component.attachBootstrapForm();
      expect(button).toBe(false);

      this.component.trigger('formSubmitStart');
      expect(button).toBe('loading');
    });

    it('should trigger .button("reset") when form submitted', function() {
      this.component.attachBootstrapForm();

      this.component.trigger('formSubmitStart');
      expect(button).toBe('loading');

      this.component.trigger('formSubmitEnd');
      expect(button).toBe('reset');
    });

    it('should not trigger when not enabled', function() {
      this.component.attachBootstrapForm({
        toggleLoadingState: false
      });
      expect(button).toBe(false);

      this.component.trigger('formSubmitStart');
      expect(button).toBe(false);
    });
  });

  describe('addErrorClass option', function() {
    it('should add error class to parent of error items', function() {
      this.component.attachBootstrapForm();
      expect(this.component
             .$node.find('#input-username')
             .parents('.form-group')
             .hasClass('has-error')).toBe(false);

      _triggerError(this);

      expect(this.component
             .$node.find('#input-username')
             .parents('.form-group')
             .hasClass('has-error')).toBe(true);
    });

    it('should add error class to errorClassParentSelector', function() {
      this.component.attachBootstrapForm({
        errorClassParentSelector: 'form'
      });

      _triggerError(this);

      expect(this.component
             .$node.find('#input-username')
             .parents('form')
             .hasClass('has-error')).toBe(true);
    });

    it('should allow the input name object key be configurable', function() {
      this.component.attachBootstrapForm({
        errorKey: 'failures'
      });

      _triggerError(this, 'failures');

      expect(this.component
             .$node.find('#input-username')
             .parent()
             .hasClass('has-error')).toBe(true);
    });

    it('should not trigger when not enabled', function() {
      this.component.attachBootstrapForm({
        addErrorClass: false
      });

      _triggerError(this);

      expect(this.component
             .$node.find('#input-username')
             .parent()
             .hasClass('has-error')).toBe(false);
    });
  });

  describe('addErrorMessages option', function() {
    // Usually comes out after the input, and is so in this case
    it('should append error message to parent of input', function() {
      this.component.attachBootstrapForm({ addErrorMessages: true });

      expect(this.component
             .$node.find('.help-block').length).toBe(0);

      _triggerError(this);

      var helpBlock = this.component
            .$node.find('#input-username')
            .next('.help-block');
      expect(helpBlock.length).toBe(1);
      expect(helpBlock.text()).toBe('This user does not exist');
    });

    it('should allow the input name object key be configurable', function() {
      this.component.attachBootstrapForm({
        addErrorMessages: true,
        errorKey: 'failures'
      });

      _triggerError(this, 'failures');

      expect(this.component
             .$node.find('#input-username')
             .next('.help-block').length).toBe(1);
    });

    it('should not trigger when not enabled', function() {
      this.component.attachBootstrapForm({ addErrorMessages: false });
      expect(this.component
             .$node.find('.help-block').length).toBe(0);

      _triggerError(this);

      expect(this.component
             .$node.find('.help-block').length).toBe(0);
    });
  });
});
