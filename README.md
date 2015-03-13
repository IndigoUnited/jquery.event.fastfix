# jquery.event.fastfix

The internals of `jquery.event.fix` might cause [unnecessary](https://github.com/jquery/jquery/issues/1746) reflows during certain events.

This library offers a built-in replace that uses ES5 getters to avoid the issue.   
The code is a basic copy of [jquerypp](https://github.com/bitovi/jquerypp/blob/master/event/fastfix/fastfix.js) fastfix with support for `AMD`/`CommonJS` and some minor code style changes.


## How to use

Simply include the `jquery.event.fastfix.js` file after jQuery is loaded.   
This plugin also integrates with `AMD` (no shim required) and `CommonJS`.


## Credits & License

Full credits goes to `jquerypp`.
License is the same.
