angular.module('starter.controllers', [])

.controller('PostsCtrl', function($scope, $stateParams, $timeout, $ionicScrollDelegate, Posts) {
  
  $scope.noMoreItemsAvailable = false;
  $scope.display_search = false;
  $scope.posts = [];
  $scope.page = 1;

  $scope.loadMore = function(){
    Posts.add($scope.page++, $stateParams.categoryId).then(function(items) {
      if (items.length == 0) {
      	$scope.noMoreItemsAvailable = true;
      }
      $scope.posts = $scope.posts.concat(items);
      $scope.$broadcast('scroll.infiniteScrollComplete');
    });
  };

  $scope.show_search = function() {
  	$ionicScrollDelegate.scrollTop();
  	$scope.display_search = true;
  	$timeout(function() {  		
	  	$(".search_input input").focus();
	  	cordova.plugins.Keyboard.show();
	}, 300);
  }
  $scope.hide_search = function() {
  	$scope.display_search = false;
  	$(".search_input input").blur();
  	cordova.plugins.Keyboard.close();
  }
})

.controller('CategoryCtrl', function($scope, $stateParams, $timeout, $ionicScrollDelegate, Posts) {
  var catID = $stateParams.categoryId;
  var subcatID = $stateParams.subcategoryId;
  
  $scope.noMoreItemsAvailable = false;
  $scope.display_search = false;
  $scope.posts = [];
  $scope.page = 1;

  $scope.titles = [];
  $scope.titles[7] = "Недвижимость";
  $scope.titles[228] = "Для бизнеса";
  $scope.catId = catID;
  $scope.subcatId = subcatID;
  $scope.subterms = [];
  Posts.subcategories(catID).then(function(subterms) {
     $scope.subterms = $scope.subterms.concat(subterms);
  })

  $scope.loadMore = function(){
    Posts.add($scope.page++, catID, subcatID).then(function(items) {
      if (items.length == 0) {
      	$scope.noMoreItemsAvailable = true;
      }
      $scope.posts = $scope.posts.concat(items);
      $scope.$broadcast('scroll.infiniteScrollComplete');
    });
  };

  $scope.show_search = function() {
  	$ionicScrollDelegate.scrollTop();
  	$scope.display_search = true;
  	$timeout(function() {  		
	  	$(".search_input input").focus();
	  	cordova.plugins.Keyboard.show();
	}, 300);
  }
  $scope.hide_search = function() {
  	$scope.display_search = false;
  	$(".search_input input").blur();
  	cordova.plugins.Keyboard.close();
  }
})

.controller('PostDetailCtrl', function($scope, $stateParams, $ionicHistory, Posts) {
  $scope.myGoBack = function() {
    $ionicHistory.goBack();
  };
  $scope.post = Posts.get($stateParams.postId);
});
