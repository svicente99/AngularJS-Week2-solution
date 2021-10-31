(function () {
'use strict';

angular.module('ShoppingListApp', [])
.controller('ToBuyController', ToBuyController_func)
.controller('AlreadyBoughtController', AlreadyBoughtController_func)
.provider('ShoppingListService', ShoppingListServiceProvider)
.config(Config);

Config.$inject = ['ShoppingListServiceProvider'];
function Config(ShoppingListServiceProvider) {
	// nothing to do...
}


ToBuyController_func.$inject = ['ShoppingListService'];
function ToBuyController_func(shopService) {
  var list = this;
  var emptyMessage = false;

  shopService.loadItems(_arrToBuyList);
  list.items = shopService.getItems(list);

  list.buyItem = function (itemIndex) {
    shopService.changeItem(itemIndex, "ToBought");
  };
  
  list.sizeOf = function() { return list.items.length; }
}

AlreadyBoughtController_func.$inject = ['ShoppingListService'];
function AlreadyBoughtController_func(shopService) {
  var list = this;
  var emptyMessage = true;

  list.items = shopService.getItems(list);

  list.returnItem = function (itemIndex) {
    shopService.changeItem(itemIndex, "ToBuy");
  };

  list.sizeOf = function() { return list.items.length; }
}

/* ----- Singleton service ----- */

function ShoppingListService() {
  var service = this;

  // 2 array Lists: one of items to buy, another for bought items
  var items2Buy = [], itemsBought = [];
  var emptyBuyMsg = false; 
  var emptyBoughtMsg = true;
  
  service.loadItems = function (arrList) {
	  items2Buy = arrList;
  };

  service.changeItem = function (index, destiny) {
	if (destiny=='ToBuy') {
		var arrTo = items2Buy, arrFrom = itemsBought;
	}
	else{
		var arrTo = itemsBought, arrFrom = items2Buy; 
	}
	this.addItem( arrTo, arrFrom[index].name, arrFrom[index].quantity );
    arrFrom.splice(index, 1);
  };
  
  service.addItem = function (items, itemName, quantity) {
    var item = {
        name: itemName,
        quantity: quantity
    };
    items.push(item);
  };

  service.getItems = function (obj) {
	return (isConstructor(obj,'ToBuy') ? items2Buy : itemsBought);
  };
}

/* ----- Service Provider ----- */

function ShoppingListServiceProvider() {
  var provider = this;

  provider.$get = function () {
    var shoppingList = new ShoppingListService()
    return shoppingList;
  };
}

function isConstructor(obj, name) {
	return obj.constructor.name.indexOf(name)==0;
}

})();