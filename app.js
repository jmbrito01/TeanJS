'use strict';

const
    ForexWatcher     = require('./watchers/forex'),
    StockWatcher     = require('./watchers/stock');


class TeanJS {
    /* @module tean-js
    * @author João Marcelo Brito
    * 
    * Creates a forex watch
    * @param {string} quote - The symbol of the forex currency (Ex: 'EURUSD')
    * @returns {ForexWatcher} the ForexWatcher object
    */   
    static createForexWatcher(quote) {
        /* @class watcher */
        let watcher = new ForexWatcher(quote);
        return watcher;
    }

    /* Creates a stock watcher
    * @param {string} quote - The symbol of the stock (Ex AAPL)
    * @param {integer} interval -'d' = Day, 'w' = Week, 'm' = Month
    * @returns {StockWatcher} the StockWatcher object
    */
    static createStockWatcher(quote, period) {
        let watcher = new StockWatcher(quote, period);
        return watcher;
    }
}   

module.exports = TeanJS;