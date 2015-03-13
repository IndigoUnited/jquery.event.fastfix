(function (root, factory) {

    'use strict';

    if (typeof define === 'function' && define.amd) {
        define(['jquery'], factory);
    } else if (typeof exports === 'object') {
        module.exports = factory(require('jquery'));
    } else {
        factory(root.jQuery);
    }
} (this, function ($) {

    'use strict';

    // http://bitovi.com/blog/2012/04/faster-jquery-event-fix.html
    // https://gist.github.com/2377196

    // IE 8 has Object.defineProperty but it only defines DOM Nodes. According to
    // http://kangax.github.com/es5-compat-table/#define-property-ie-note
    // All browser that have Object.defineProperties also support Object.defineProperty properly
    var set,
        special;

    if (Object.defineProperties) {
            // Use defineProperty on an object to set the value and return it
            set = function (obj, prop, val) {
                if (val !== undefined) {
                    Object.defineProperty(obj, prop, {
                        value : val
                    });
                }

                return val;
            };

            // Special converters
            special = {
                pageX : function (original) {
                    if (!original) {
                        return;
                    }

                    var eventDoc = this.target.ownerDocument || document,
                        doc = eventDoc.documentElement,
                        body = eventDoc.body;

                    return original.clientX + ( doc && doc.scrollLeft || body && body.scrollLeft || 0 ) - ( doc && doc.clientLeft || body && body.clientLeft || 0 );
                },
                pageY : function (original) {
                    if (!original) {
                        return;
                    }

                    var eventDoc = this.target.ownerDocument || document,
                        doc = eventDoc.documentElement,
                        body = eventDoc.body;

                    return original.clientY + ( doc && doc.scrollTop || body && body.scrollTop || 0 ) - ( doc && doc.clientTop || body && body.clientTop || 0 );
                },
                relatedTarget : function (original) {
                    if (!original) {
                        return;
                    }

                    return original.fromElement === this.target ? original.toElement : original.fromElement;
                },
                metaKey : function (originalEvent) {
                    if (!originalEvent) {
                        return;
                    }

                    return originalEvent.ctrlKey;
                },
                which : function (original) {
                    if (!original) {
                        return;
                    }

                    return original.charCode != null ? original.charCode : original.keyCode;
                }
            };

        // Get all properties that should be mapped
        $.each($.event.keyHooks.props.concat($.event.mouseHooks.props).concat($.event.props), function (i, prop) {
            if (prop !== 'target') {
                (function () {
                    Object.defineProperty($.Event.prototype, prop, {
                        get : function () {
                            // Get the original value, undefined when there is no original event
                            var originalValue = this.originalEvent && this.originalEvent[prop];
                            // Overwrite getter lookup
                            return this['_' + prop] !== undefined ? this['_' + prop] : set(this, prop,
                                // If we have a special function and no value
                                special[prop] && originalValue === undefined ?
                                    // Call the special function
                                    special[prop].call(this, this.originalEvent) :
                                    // Use the original value
                                    originalValue);
                        },
                        set : function (newValue) {
                            // Set the property with underscore prefix
                            this['_' + prop] = newValue;
                        }
                    });
                })();
            }
        });

        $.event.fix = function (event) {
            if (event[$.expando]) {
                return event;
            }

            // Create a jQuery event with at minimum a target and type set
            var originalEvent = event;

            event = $.Event(originalEvent);
            event.target = originalEvent.target;

            // Support: Cordova 2.5 (WebKit) (#13255)
            // All events should have a target; Cordova deviceready doesn't
            if (!event.target) {
                event.target = document;
            }

            // Support: Safari 6.0+, Chrome<28
            // Target should not be a text node (#504, #13143)
            if (event.target.nodeType === 3) {
                event.target = event.target.parentNode;
            }

            return event;
        };
    }

    return $;
}));
