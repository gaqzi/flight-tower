# flight-tower

[![Build Status](https://secure.travis-ci.org/gaqzi/flight-tower.png)](http://travis-ci.org/gaqzi/flight-tower)
[![Coverage Status](https://coveralls.io/repos/gaqzi/flight-tower/badge.png)](https://coveralls.io/r/gaqzi/flight-tower)

A collection of [Flight](https://github.com/flightjs/flight) mixins
that aids in communicating with backend services. 

## Installation

```bash
bower install --save flight-tower
```

## Mixins

### withAjax

This mixin will emit life cycle and success/fail events for an ajax request.

#### API

* `get(url, eventName[, data])`
* `post(url, data, eventName)`
* `ajax(url, ajaxOptons, options|eventName)`
* `retryRequest(failData)` - will try for `attr.retryRetries` times
  max, default 10. Can also be used as an event handler for dataFail
  events.

`.get`/`.post` are both thin wrappers around `.ajax` which in turn is
a thin wrapper around [$.ajax`](http://api.jquery.com/jQuery.ajax/).

All methods returns the jQuery promise from $.ajax in case you want to
add your own callback to the mix.

#### `.ajax` options

* `eventName` - the name that ajax will use to distinguish between
  different requests. See events for more details.
* `many` - whether mulitple simultaneous requests should be allowed to
  the same URL at once. Default is false.

#### Events

##### .get/.post/.ajax events
All events are created out of the eventName you pass in. The examples
all use the event `Example`.

The event names are based off of the suggested naming conventions in
[Getting Started with Twitter Flight](http://amzn.to/1fUmc7o).
All:
* `dataExample` - a successful request
* `dataExampleFail` - a failed request

`dataExampleFail` will trigger with the data to reproduce the request
as well as status and response from the server.

GET/HEAD events:
* `fetchExampleStart`
* `fetchExampleEnd`

POST/PUT/PATCH events (any other than get/head):
* `submitExampleStart`
* `submitExampleEnd`

##### .retryRequest events

* `retryAjax` - trigger just as a request is about to be retried
* `retryAjaxSuccess` - after a request has successfully been retried
* `retryAjaxTooMany` - if the request has been retried too many times

## Example

```javascript
define(function(require) {
    var defineComponent = require('flight/lib/component'),
        withAjax = require('flight-tower/lib/with_ajax');

    return defineComponent(formData, withAjax);

    function formData() {
        this.defaultAttrs({
            redoRetries: 10
        });

        this.after('initialize', function() {
            this.get('/some-data', 'Countries');
            this.post('/submit', {user: 'test', password: 1234}, 'UserLogin');
            this.ajax('/submit', {data: {user: 'test', password: 1234}}, 'UserLogin');

            this.on('dataUserLoginFail', this.retryRequest);
        });
    }
});

```
## Development

Development of this component requires [Bower](http://bower.io) to be globally
installed:

```bash
npm install -g bower
```

Then install the Node.js and client-side dependencies by running the following
commands in the repo's root directory.

```bash
npm install & bower install
```

To continuously run the tests in Chrome during development, just run:

```bash
npm run watch-test
```

## Contributing to this project

Anyone and everyone is welcome to contribute. Please take a moment to
review the [guidelines for contributing](CONTRIBUTING.md).

* [Bug reports](CONTRIBUTING.md#bugs)
* [Feature requests](CONTRIBUTING.md#features)
* [Pull requests](CONTRIBUTING.md#pull-requests)
