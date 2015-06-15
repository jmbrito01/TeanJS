/* @module tean-js
 * @author João Marcelo Brito
 * 
 * Creates a forex watch
 * @param {string} quote - The symbol of the forex currency (Ex: 'EURUSD')
 * @returns {ForexWatcher} the ForexWatcher object
 */      
createForexWatch = function (quote) {
    var fx = require('yahoo-currency');
    /*@class watcher*/
    var watcher = {
        symbol : quote
    };

    watcher.getSnapshot = function (cb) {
        fx.fullRate().then(function (rate) { 
            cb(rate[watcher.symbol]);
        });
    }
    return watcher;
}

/* Creates a stock watcher
 * @param {string} quote - The symbol of the stock (Ex AAPL)
 * @param {integer} interval -'d' = Day, 'w' = Week, 'm' = Month
 * @returns {StockWatcher} the StockWatcher object
 */
createStockWatch = function (quote, interval) {
    var watcher = {
        symbol: quote, 
        interval: interval
    };
    var finance = require('yahoo-finance');   
    var Promise = require('promise');
    /* Retrieves a snapshot object of the stock
     * @function getSnapshot
     * @param {callback} cb: a callback with 2 parameters     
     * */
    watcher.getSnapshot = function (cb){
        finance.snapshot({
            symbol: this.symbol,
            fields: ['s', 'n', 'd1', 'l1', 'y', 'r']
        }, function (err, snapshot) {
            cb(err, snapshot);
        });
    }
    /* Retrieves an array of objects containing the historical values of the stock
     * 
     * @param {Date} from - Start period Ex: '2015-06-01'
     * @param {Date} end = period Ex: '2015-06-14'
     * @param {callback} cb - callback function with 2 params
     */
    watcher.getHistorical = function (from, to, cb) {
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
    watcher.getMax = function (period, cb) {
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
    watcher.getMin = function (period, cb) {
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
     * @returns {integer} the SMA of the period.
     */
    watcher.getSMA = function (period) {
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
    return watcher;
}

var watcher = createStockWatch('WMT', 'd');
watcher.getSMA(10).then(function (sma) {
    console.log(sma);
});