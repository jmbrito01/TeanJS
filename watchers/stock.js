'use strict';

const
    finance = require('yahoo-finance');   

class StockWatcher {
    constructor(stock, interval) {
        this.symbol = stock;
        this.interval = interval;


    }

    /* Retrieves a snapshot object of the stock
     * @function getSnapshot    
     * 
     */
    getSnapshot() {
        return new Promise(function (fulfill, reject) {
            finance.snapshot({
                symbol:watcher.symbol,
                fields: ['s', 'n', 'd1', 'l1', 'y', 'r']
            }, function (err, snapshot) {
                if (err != null)
                    reject(err);
                else
                    fulfill(snapshot);
            });
        });
    }

    /* Retrieves an array of objects containing the historical values of the stock
     * 
     * @param {Date} from - Start period Ex: '2015-06-01'
     * @param {Date} end = period Ex: '2015-06-14'
     * @param {callback} [cb] - callback function with 2 params
     */
    getHistorical(from, end, cb) {
        if (cb === undefined) {
            return new Promise(function (fulfill, reject) {
                finance.historical({
                    symbol: watcher.symbol,
                    from: from,
                    to: to,
                    period: watcher.interval
                }, function (err, quotes) { 
                    if (err != null)
                        reject(err);
                    else
                        fulfill(quotes);
                });
                                
            });
        }
           
        finance.historical({
            symbol: this.symbol,
            from: from,
            to: to,
            period: this.interval
        }, function (err, quotes) {
            cb(err, quotes);
        });
    }
    /* Gets the max close price from the period 
     * @param {integer} period - period of the max price search
     * @param {callback} cb - callback with the result
     */
    getMax(period, cb) {
        if (watcher.interval == 'd')
            var from = new Date((new Date()).getTime() - (new Date(period * 24 * 60 * 60 * 1000)));
        else if (watcher.interval == 'w')
            var from = new Date((new Date()).getTime() - (new Date(period * 7 * 24 * 60 * 60 * 1000)));
        else if (watcher.interval == 'm')
            var from = new Date((new Date()).getTime() - (new Date(period * 30 * 24 * 60 * 60 * 1000)));
        watcher.getHistorical(from, new Date(), function (err, quotes) {
            if (err == null)
                cb(null);
            var max = 0;
            for (var i = 0; i < quotes.length; i++) 
                if (quotes[i].close > max)
                    max = quotes[i].close;
            cb(max);
        });
    }
    /* Gets the min close price from the period 
     * @param {integer} period - period of the min price search
     * @param {callback} cb - callback with the result
     */
    getMin(period, cb) {
        if (watcher.interval == 'd')
            var from = new Date((new Date()).getTime() - (new Date(period * 24 * 60 * 60 * 1000)));
        else if (watcher.interval == 'w')
            var from = new Date((new Date()).getTime() - (new Date(period * 7 * 24 * 60 * 60 * 1000)));
        else if (watcher.interval == 'm')
            var from = new Date((new Date()).getTime() - (new Date(period * 30 * 24 * 60 * 60 * 1000)));
        watcher.getHistorical(from, new Date(), function (err, quotes) {
            if (err == null)
                cb(null);
            var min = watcher.getMax();
            for (var i = 0; i < quotes.length; i++)
                if (quotes[i].close < min)
                    max = quotes[i].close;
            cb(max);
        });
    }

    /* Gets the SMA close price from the period 
     * @param {integer} period - period of the SMA price search
     * @returns {object} {high, low}
     */
    getSMA(period) {
        if (watcher.interval == 'd')
            var from = new Date((new Date()).getTime() - (new Date(period * 24 * 60 * 60 * 1000)));
        else if (watcher.interval == 'w')
            var from = new Date((new Date()).getTime() - (new Date(period * 7 * 24 * 60 * 60 * 1000)));
        else if (watcher.interval == 'm')
            var from = new Date((new Date()).getTime() - (new Date(period * 30 * 24 * 60 * 60 * 1000)));
        return new Promise(function (fulfill, reject) {
            watcher.getHistorical(from, new Date(), function (err, quotes) {
                if (err != null)
                    reject(err);
                var sum = 0;
                for (var i = 0; i < quotes.length; i++) {
                    sum = sum + quotes[i].close;
                    if (i == (quotes.length - 1))
                        fulfill(sum/quotes.length)
                };

            });
        });
    }

    /* Gets the MAHL(Moving Average High Low) from the period 
     * @param {integer} period - period of the MAHL search
     * @returns {integer} the MAHL of the period.
     */
    getMAHL(period) {
        if (watcher.interval == 'd')
            var from = new Date((new Date()).getTime() - (new Date(period * 24 * 60 * 60 * 1000)));
        else if (watcher.interval == 'w')
            var from = new Date((new Date()).getTime() - (new Date(period * 7 * 24 * 60 * 60 * 1000)));
        else if (watcher.interval == 'm')
            var from = new Date((new Date()).getTime() - (new Date(period * 30 * 24 * 60 * 60 * 1000)));
        return new Promise(function (fulfill, reject) {
            watcher.getHistorical(from, new Date(), function (err, quotes) {
                if (err != null)
                    reject(err);
                var high = 0;
                var low = 0;
                for (var i = 0; i < quotes.length; i++) {
                    high = high + quotes[i].high;
                    low = low + quotes[i].low;
                    if (i == (quotes.length - 1))
                        fulfill({
                            ma_high: high / quotes.length,
                            ma_low: low /quotes.length
                        });
                };

            });
        });
    }

    getRSI(period) {
        if (watcher.interval == 'd')
            var from = new Date((new Date()).getTime() - (new Date(period * 24 * 60 * 60 * 1000)));
        else if (watcher.interval == 'w')
            var from = new Date((new Date()).getTime() - (new Date(period * 7 * 24 * 60 * 60 * 1000)));
        else if (watcher.interval == 'm')
            var from = new Date((new Date()).getTime() - (new Date(period * 30 * 24 * 60 * 60 * 1000)));
        return new Promise(function (fulfill, reject) {
            watcher.getHistorical(from, new Date(), function (err, quotes) {
                if (err != null)
                    reject(err);
                var up = 0;
                var down = 0;
                for (var i = 0; i < quotes.length; i++) {
                    if (quotes[i].close > quotes[i].open)
                        up++;
                    if (quotes[i].close < quotes[i].open)
                        down++;
                    if (i == (quotes.length - 1))
                        fulfill(100 - 100 / (1 + ((up /quotes.length) / (down /quotes.length))));
                };

            });
        });

        /* Gets the RSI close price from the period 
     * @param {integer} period - period of the RSI price search
     * @returns {integer} the RSI of the period.
     */
    }

    /* Gets the Average True Range(ATR) of the stock
     * @param {integer} period - the period of the ATR
     * @param {inteher} method - the method to calculate the True Range( 1 for High-low; 2 for High-close;3 for Low-close)
     * @result {float} the ATR
     */

    getATR(period, method) {
        if (watcher.interval == 'd')
            var from = new Date((new Date()).getTime() - (new Date(period * 24 * 60 * 60 * 1000)));
        else if (watcher.interval == 'w')
            var from = new Date((new Date()).getTime() - (new Date(period * 7 * 24 * 60 * 60 * 1000)));
        else if (watcher.interval == 'm')
            var from = new Date((new Date()).getTime() - (new Date(period * 30 * 24 * 60 * 60 * 1000)));
        return new Promise(function (fulfill, reject) {
            watcher.getHistorical(from, new Date(), function (err, quotes) {
                if (err != null)
                    reject(err);
                var sum = 0;
                for (var i = 0; i < quotes.length; i++) {
                    switch (method) {
                        case 1:
                            sum = sum + quotes[i].high - quotes[i].low;
                            break;
                        case 2:
                            sum = sum + Math.abs(quotes[i].high - quotes[i].close);
                            break;
                        case 3:
                            sum = sum + Math.abs(quotes[i].low - quotes[i].close);
                            break;
                    };
                    if (i == quotes.length - 1)
                        fulfill(sum / quotes.length);
                };

            });
        });
    }

    /* Returns if it's a good idea to buy based on the technical indicatiors of the module
     * @param {integer} period - period of the buy, if its a quick buy set to low values, and a long-term bet big values.
     * @param {integer} precision - this precision is the min quotient of the buy/dont buy list of technical indications
     * @returns {bool} true if it's a good idea to buy, false if it's not.
     */
    isGoodToBuy(period, precision) {
        var good = 0;
        var not = 0;
        return new Promise(function (fulfill, reject) {
            watcher.getRSI(period).then(function (rsi) {
                if (rsi <= 30) good++;
                else not++;
                watcher.getSMA(period).then(function (sma) {
                    watcher.getSnapshot().then(function (snapshot) { 
                        if (sma > snapshot.lastTradePriceOnly)
                            good++;
                        else
                            not++;
                        if (precision <= (good / not))
                            fulfill(true);
                        else
                            fulfill(false);
                    });
                });
            });
        });
    }

    /* Returns if it's a good idea to sell based on the technical indicatiors of the module
     * @param {integer} period - period of the sell, if its a quick buy set to low values, and a long-term bet big values.
     * @param {integer} precision - this precision is the min quotient of the sell/dont sell list of technical indications
     * @returns {bool} true if it's a good idea to sell, false if it's not.
     */
    isGoodToSell(period, precision) {
        var good = 0;
        var not = 0;
        return new Promise(function (fulfill, reject) {
            watcher.getRSI(period).then(function (rsi) {
                if (rsi >= 70) good++;
                else not++;
                watcher.getSMA(period).then(function (sma) {
                    watcher.getSnapshot().then(function (snapshot) {
                        if (sma < snapshot.lastTradePriceOnly)
                            good++;
                        else
                            not++;
                        if (precision <= (good / not))
                            fulfill(true);
                        else
                            fulfill(false);
                    });
                });
            });
        });
    }
}

module.exports = StockWatcher;