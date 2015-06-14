/* createForexWatch function 
 * Description: Creates a forex watch
 * Params: 
 *      quote: The symbol of the forex currency (Ex: 'EURUSD')
 * Return: 
 *      An object to handle this forex currency
 */      
exports.createForexWatch = function (quote) {
    var fx = require('yahoo-currency');
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

/* createStockWatch function
 * Description: Creates a stock watcher
 * Params:
 *      quote: The symbol of the stock (Ex AAPL)
 *      interval: 'd' = Day, 'w' = Week, 'm' = Month
 * Return:
 *      An object to handle this stock or null if error */
exports.createStockWatch = function (quote, interval) {
    var watcher = {
        symbol: quote, 
        interval: interval
    };
    var finance = require('yahoo-finance');
    var timeseries = require('timeseries-analysis');
    
    /* getSnapshot function
     * Description: Retrieves a snapshot object of the stock
     * Params:
     *      cb: a callback with 2 parameters
     *          err: null is no error, or the error itself.
     *          snapshot: An object containing the stock informations.
     *        
     * */
    watcher.getSnapshot = function (cb){
        finance.snapshot({
            symbol: this.symbol,
            fields: ['s', 'n', 'd1', 'l1', 'y', 'r']
        }, function (err, snapshot) {
            cb(err, snapshot);
        });
    }
    /* getHistorical function
     * Description: Retrieves an array of objects containing the historical values of the stock
     * Params:
     *      from: Start period Ex: '2015-06-01'
     *      to: End period Ex: '2015-06-14'
     *      cb: callback function with 2 params
     *          err: null if no error, the error itself otherwise.
     *          quotes: An array of objects containing the historical values.
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
    return watcher;
}