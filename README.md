# TeanJS

This is a simple NodeJS module that encapsulated yahoo-finance, yahoo-currency and some 
math functions in a powerfull and fast technical analysis package.
We plan on later versions add technical analysis and chart functions.

#Changelog:
```
* 1.0.0
	* Forex Snapshots
	* Quote Snapshots
	* Quote Historical Values.
* 1.0.1
	* Added getMax, getMin, getSMA to StockWatcher
	* Added JSDoc
* 1.0.2
	* Some Bugfixes
* 1.0.3
	* Added getRSI to StockWatcher
* 1.0.4
	* Added isGoodToBuy & isGoodToSell(Not ready) to StockWatcher
	* Added promise support for StockWatcher.getSnapshot
* 1.1.0
	* Added exchangeCurrency to ForexWatcher
	* Added getMAHL getATR to StockWatcher
	* Added promise support for StockWatcher.getHistorical
* 1.1.1
	* Complete refactor to ES6	
```	

#Dependencies
	JSDoc, yahoo-currency, yahoo-finance, promise.

License: MIT