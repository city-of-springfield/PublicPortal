

/**
 * The Publisher module provides the publish/subscribe pattern via a mix-in style.
 * This implementation is from the "JavaScript Patterns" book by Stoyan Stefanov.
 * 
 * @param {Log} log
 * @returns {Publisher}
 */
define(['model/util/Log'],
    function (log) {
        "use strict";
        var Publisher = {
            subscribers: {
                any: []
            },
            /**
             * Creates a subscription on the given event type.
             * @param {String} type The event type.
             * @param {Function} fn The handler for the event.
             * @param {Object} context The context for the handler. Optional.
             */
            on: function (type, fn, context) {
                if ((typeof type) === 'undefined') {
                    var caller_line = (new Error()).stack.split("\n")[4];
                    log.error('Publisher', 'on', 'type arg is "undefined", is this really the intent? ' + caller_line);
//                    throw new (log.error('Publisher', 'on', 'type arg is "undefined", is this really the intent?'));
                }
                type = type || 'any';
                fn = (typeof fn === "function") ? fn : context[fn];

                if ((typeof this.subscribers[type]) === 'undefined') {
                    this.subscribers[type] = [];
                }
                this.subscribers[type].push({
                    fn: fn,
                    context: context || this});
            },
            /**
             * Cancels the subscription to the given event.  This function is the opposite of on(...) and it's 
             * arguments must match those passed to on(...)
             * @param {String} type The event type.
             * @param {Function} fn The handler for the event.
             * @param {Object} context The context for the handler. Optional.
             */
            cancelSubscription: function (type, fn, context) {
                this.visitSubscribers('unsubscribe', type, fn, context);
            },
            /**
             * Fires the event by calling each of the subscribers event handler.
             * @param {String} type The event type.
             * @param {Object} publication The event payload, often "this".
             */
            fire: function (type, publication) {
                if ((typeof type) === 'undefined') {
                    throw new TypeError(log.error('Publisher', 'fire', 'Event type is "undefined".'));
                }
                this.visitSubscribers('publish', type, publication);
            },
            /**
             * Internal function the 
             * @param {type} action
             * @param {type} type
             * @param {type} arg
             * @param {type} context
             * @returns {undefined}
             */
            visitSubscribers: function (action, type, arg, context) {
                var pubtype = type || 'any',
                    subscribers = this.subscribers[pubtype],
                    i,
                    max = subscribers ? subscribers.length : 0;

                for (i = 0; i < max; i += 1) {
                    if (action === 'publish') {
                        subscribers[i].fn.call(subscribers[i].context, arg);
                    } else {
                        if (subscribers[i].fn === arg && subscribers[i].context === context) {
                            subscribers.splice(i, 1);
                        }
                    }
                }
            },
            /**
             * Makes the given object a Publisher by adding the this object's functions and properties to it.
             * @param {Object} o The object that becomes a publisher.
             */
            makePublisher: function (o) {
                if (o.subscribers) {
                    return; // o is already a Publisher
                }
                var i;
                for (i in Publisher) {
                    if (Publisher.hasOwnProperty(i) && typeof Publisher[i] === 'function') {
                        o[i] = Publisher[i];
                    }
                }
                o.subscribers = {any: []};
            }
        };
        return Publisher;
    }
);

