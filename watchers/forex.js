'use strict';

const
    fx = require('yahoo-currency');

class ForexWatcher {
    constructor(quote) {
        this.symbol = quote;
    }

    getSnapshot() {
        return new Promise(function (fulfill, reject) { 
            fx.fullRate().then(function (rate) { 
                fulfill(rate);
            });
        });
    }
    /*
     * Converts the currency forex symbol with a selected amount of money
     * @function ForexWatcher#exchangeCurrency
     * @param {float} money - the money amount to be converted.
     * @returns {float} the money amount converted
     */
    exchangeCurrency(money) {
        return new Promise(function (fulfill, reject) {
            watcher.getSnapshot().then(function (rate) { 
                fulfill(rate[watcher.symbol] * money);
            });
        });
    }
}

module.exports = ForexWatcher;