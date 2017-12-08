angular.module('myApp', ['ngResource']);


/////////////////// SERVER API ///////////////////////
angular.module('myApp').provider('zebpayData', zebpayDataProvider);

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
angular.module('myApp').component('ticker', {
  templateUrl: 'js/app.html',
  controller: myController
});

function myController($interval, $window, filterFilter, zebpayData) {
  const vm = this;
  let isFetchInProgress = false;
  vm.$onInit = activate;

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

    startPoller();
  }

  function startPoller() {
    $interval(function() {
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
          if(response.market != vm.priceData.market || response.buy != vm.priceData.buy || response.sell != vm.priceData.sell || response.volume != vm.priceData.volume) {
            vm.delta.buy = response.buy - vm.priceData.buy;
            vm.delta.sell = response.sell - vm.priceData.sell;
            vm.delta.market = response.market - vm.priceData.market;
            vm.delta.volume = response.volume - vm.priceData.volume;

            vm.priceData.buy = response.buy;
            vm.priceData.sell = response.sell;
            vm.priceData.market = response.market;
            vm.priceData.volume = response.volume;

            $window.document.title = vm.priceData.market.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
          }
          isFetchInProgress = false;
        }

        function errorCallback(error) {
          console.log("Error in fetching ", error);
          isFetchInProgress = false;
        }
      }
    }, 3000);
  }
}
