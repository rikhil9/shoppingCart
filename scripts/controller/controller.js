(function() {
    
    var app = angular.module('shoppingApp', []);
   
    app.filter('capitalize', function () {
        return function (input) {
          return (!!input) ? input.charAt(0).toUpperCase() + input.substr(1).toLowerCase() : '';
        }
    });
    
    app.directive('cartItems', function () {
        return {
            restrict: 'C',      
            templateUrl: 'scripts/directive/cartItem.html',
            controller:'cartController',
            link:function(scope, element, attrs){
                console.log("RIkhillllllllllaaaa");
              

            }
        }
    });
    
    app.service('MyCart', ['$http', '$rootScope', function ($http, $rootScope) {
        var items = null;
        var Total = 0;

        return {
            getItems: function() {
                  if(items== null){
                      $http.get("../assets/cart.json")
                        .then(function(response) {
                        
                          $rootScope.$broadcast('cartChanged', response.data.productsInCart);
                          return response.data.productsInCart;
                        }, function(){
                          
                          $rootScope.$broadcast('cartChanged', null);
                          return null;
                      });
                  }else{
                      return items;
                  }
                
            },
            setItems: function(value) {
                items = value;
            },
            getTotal: function(){
                Total =0;
                angular.forEach(items, function (item) {
                    Total+=(item.p_originalprice*item.p_quantity);
                     
                });
                return Total;
            },
            setTotal: function(value){
                Total = value;
            }
        };
    }]);
    
app.controller('cartController', ['$scope','MyCart','$http','$rootScope' ,function($scope, MyCart, $http, $rootScope) {
     $scope.productsInCart = MyCart.getItems();
   
    
    /*watching cart item changes*/
   /* $scope.$watch('productsInCart',function(){
      CartItems.setItems($scope.productsInCart);
    });*/
     $rootScope.$on('cartChanged', function(event, cartItems){
         MyCart.setItems(cartItems);
        $scope.productsInCart = MyCart.getItems();
         $scope.totalPrice = MyCart.getTotal();
       /* $scope.totalPrice = 0;
         angular.forEach($scope.productsInCart, function (item) {
               $scope.totalPrice+= item.p_price;
            });
         
           MyCart.setTotal($scope.totalPrice);*/
         
        });
    
     
    
   
    
$scope.alertMessage = function(){
    alert("Hello pinku");
}    
    
    /*removing product from cart*/
  $scope.removeProduct = function(item){
     
      for (var i =0, len = $scope.productsInCart.length; i<len; i++ ){
          if(item.p_id === $scope.productsInCart[i].p_id){
              $scope.productsInCart.splice(i,1);
               $rootScope.$broadcast('cartChanged', $scope.productsInCart);
                    return;//send request to server for updation of cart
          }
      }
      
  }
  $scope.quantityChanged = function(event){
      $rootScope.$broadcast('cartChanged', $scope.productsInCart);
  }
  
  
}]);
    app.controller('billingController',['$scope', 'MyCart', '$rootScope', function($scope, myCart,$rootScope) {
       
        $scope.MyCart = myCart;
       $rootScope.$on('cartChanged', function(event, cartItems){
         myCart.setItems(cartItems);
        $scope.productsInCart = myCart.getItems();
        /*$scope.totalPrice = 0;
         angular.forEach($scope.productsInCart, function (item) {
               $scope.totalPrice+= item.p_price;
            });
         
           myCart.setTotal($scope.totalPrice);*/
         
        });
        
        
        
        
        
        
    }]);
    app.directive('billingSection', function () {
        return {
            restrict: 'C', //E = element, A = attribute, C = class, M = comment   
            controller : 'billingController',
            templateUrl: 'scripts/directive/billing.html',
            link:function(scope, element, attrs){
            

            }
        }
    });



})();