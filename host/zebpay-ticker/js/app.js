angular.module('zebpayTickerApp', ['ngResource']);


/////////////////// SERVER API ///////////////////////
angular.module('zebpayTickerApp').provider('zebpayData', zebpayDataProvider);

function zebpayDataProvider() {
  let url = 'https://www.zebapi.com/api/v1/market/ticker/btc/inr';
  this.$get = $get;

  function $get($resource) {
    return {
      serverRates: serverRates
    };

    function serverRates() {
      return $resource(url);
    }
  }
}


/////////////////// UI ///////////////////////
angular.module('zebpayTickerApp').component('ticker', {
  templateUrl: 'js/app.html',
  controller: myController
});

function myController($interval, $window, filterFilter, zebpayData) {
  const vm = this;
  let isFetchInProgress = false;
  vm.$onInit = activate;
  vm.getCurrencyFormattedString = getCurrencyFormattedString;
  vm.setUpdateSpeed = setUpdateSpeed;

  function activate() {
    vm.priceData = {
      market: 0,
      buy: 0,
      sell: 0,
      volume: 0
    };

    vm.delta = {
      buy: 0,
      sell: 0,
      market: 0,
      volume: 0
    };

    vm.startTime = Date.now();
    vm.updateSpeed = 3000;

    initializeCharts();
    fetchAndUpdateServerRates();
    startPoller();
  }

  function initializeCharts() {
    vm.buyDataPoints = [];
    vm.sellDataPoints = [];

    vm.buyChart = new CanvasJS.Chart("buy-graph", {
    	exportEnabled: true,
    	title :{
    		text: "Buy Price (INR/BTC)"
    	},
      toolTip: {
        contentFormatter: function(dataSets) {
          let priceString = '<strong>Rs. ' + getCurrencyFormattedString(dataSets.entries[0].dataPoint.y, false) + '</strong>';
          let dateString = (new Date((dataSets.entries[0].dataPoint.x * 1000) + vm.startTime)).toLocaleTimeString();
          return (priceString + ' @ ' + dateString);
        }
      },
    	axisY: {
    		includeZero: false
    	},
    	data: [{
    		type: "line",
    		markerSize: 0,
    		dataPoints: vm.buyDataPoints
    	}]
    });

    vm.sellChart = new CanvasJS.Chart("sell-graph", {
    	exportEnabled: true,
    	title :{
    		text: "Sell Price (INR/BTC)"
    	},
      toolTip: {
        contentFormatter: function(dataSets) {
          let priceString = '<strong>Rs. ' + getCurrencyFormattedString(dataSets.entries[0].dataPoint.y, false) + '</strong>';
          let dateString = (new Date((dataSets.entries[0].dataPoint.x * 1000) + vm.startTime)).toLocaleTimeString();
          return (priceString + ' @ ' + dateString);
        }
      },
    	axisY: {
    		includeZero: false
    	},
    	data: [{
    		type: "line",
    		markerSize: 0,
    		dataPoints: vm.sellDataPoints
    	}]
    });
  }

  function getCurrencyFormattedString(value, showSign) {
    if (value === 0) {
      return '0';
    }

    let signSymbol = (value > 0) ? '+' : '-';

    if (value < 0) {
      value = value * -1;
    }
    value = Math.floor(value);

    let formattedString = ('000' + (value % 1000)).substr(-3);
    value = Math.floor(value / 1000);
    while (value > 0) {
      formattedString = ('00' + (value % 100)).substr(-2) + ',' + formattedString;
      value = Math.floor(value / 100);
    }
    while (formattedString.length && formattedString[0] === '0') {
      formattedString = formattedString.substr(1);
    }

    return (showSign) ? signSymbol + formattedString : formattedString;
  }

  function updateServerRates(response) {
    if(response.market != vm.priceData.market ||
      response.buy != vm.priceData.buy ||
      response.sell != vm.priceData.sell ||
      response.volume != vm.priceData.volume) {
      // update deltas
      vm.delta.buy = response.buy - vm.priceData.buy;
      vm.delta.sell = response.sell - vm.priceData.sell;
      vm.delta.market = response.market - vm.priceData.market;
      vm.delta.volume = response.volume - vm.priceData.volume;

      // update values
      vm.priceData.buy = response.buy;
      vm.priceData.sell = response.sell;
      vm.priceData.market = response.market;
      vm.priceData.volume = response.volume;

      // set window title
      $window.document.title = 'Rs. ' + getCurrencyFormattedString(vm.priceData.market, false);

      // update buy price graph
      vm.buyDataPoints.push({
        x: (Date.now() - vm.startTime) / 1000,
        y: vm.priceData.buy
      });
      vm.buyChart.render();

      // update sell price graph
      vm.sellDataPoints.push({
        x: (Date.now() - vm.startTime) / 1000,
        y: vm.priceData.sell
      });
      vm.sellChart.render();
    }
  }

  function fetchAndUpdateServerRates() {
    if(!isFetchInProgress) {
      isFetchInProgress = true;

      zebpayData.serverRates().get(
        {
          antiCache: Date.now()
        },
        successCallback.bind(this),
        errorCallback.bind(this)
      );

      function successCallback(response) {
        updateServerRates(response);
        isFetchInProgress = false;
      }

      function errorCallback(error) {
        console.log("Error in fetching ", error);
        isFetchInProgress = false;
      }
    }
  }

  function setUpdateSpeed(speedInMillis) {
    vm.updateSpeed = speedInMillis;
    startPoller();
  }

  function startPoller() {
    if (vm.pollerInstancePromise) {
      $interval.cancel(vm.pollerInstancePromise);
    }
    vm.pollerInstancePromise = $interval(function() {
      fetchAndUpdateServerRates();
    }, vm.updateSpeed);
  }
}
