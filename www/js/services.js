angular.module('starter.services', [])

.factory('Posts', function($http, $q, $ionicHistory) {  
  var BASE_URL = "http://ca.workplay.in/";
  var posts = [];

  return {
    all: function() {
      return $http.get(BASE_URL+'wp-json/posts?filter[posts_per_page]=5&page=1&').then(function(response){
        items = response.data;
        // console.log(items);
        return items;
      });
    },
    add: function(page, category, subcategory) {
      append = (category!='null') ? '&filter[cat]='+category : '';
      return $http.get(BASE_URL+'wp-json/posts?filter[posts_per_page]=5'+append+'&page='+page).then(function(response){
        items = response.data;
        if (subcategory) {
          items = items.filter(function(item,i,arr) {
            return item.terms.category[0].ID == subcategory;
          });
        }
        // console.log(items);
        return items;
      });
    },
    subcategories: function(categoryID) {
      var dumb = [];
      dumb[228] = 236;
      return $http.get(BASE_URL+'wp-json/posts/types/posts/taxonomies/category/terms').then(function(response) {
        terms = response.data;
        var subterms = terms.filter(function(item, i, arr) {
          return item.parent && ((item.parent.ID == categoryID ) || (item.parent.ID == dumb[categoryID]));
        });
        return subterms;
      });
    },
    get: function(postId) {
      var post = [];
      $http.get(BASE_URL+'wp-json/posts/'+postId)
        .success(function(data, status, headers, config){
          console.log(status);
        })
        .error(function(data, status, headers, config){
          console.log(status);
        })
        .then(function(response){
          var jsonData = response.data;
          post.push(jsonData);
          console.log(post[0]);
          ed = post[0].post_meta.expired.split('-');
          var d = new Date(ed[0], ed[1], ed[2]);
          var today = new Date();
          post[0].post_meta.expire_date = ed[2]+"."+ed[1]+"."+ed[0];
          post[0].post_meta.expired = Date.parse(post[0].post_meta.expired) < today;
        });
      return post;
    }
  };
})

.factory('appLoading', function($rootScope) {
    return {
      loading : function() {
        $rootScope.status = 'loading';
        if(!$rootScope.$$phase) $rootScope.$apply();
      },
      ready : function(delay) {
        $rootScope.status = 'ready';
        if(!$rootScope.$$phase) $rootScope.$apply();
      }
    };
  })

.directive('autoFocus', function($timeout) {
    return {
        restrict: 'AC',
        link: function(_scope, _element) {
            $timeout(function(){
                _element[0].focus();
            }, 0);
        }
    };
})

.directive('ionSearch', function() {
  var timer;
        return {
            restrict: 'E',
            replace: true,
            // scope: {
            //     getData: '&source',
            //     model: '=?',
            //     search: '=?filter'
            // },
            link: function(scope, element, attrs) {
                attrs.minLength = attrs.minLength || 0;
                scope.placeholder = attrs.placeholder || '';
                scope.search = {value: ''};

                if (attrs.class)
                    element.addClass(attrs.class);

                if (attrs.source) {
                    scope.$watch('search.value', function (newValue, oldValue) {
                        if (newValue.length > attrs.minLength) {
                            scope.getData({str: newValue}).then(function (results) {
                                scope.model = results;
                            });
                        } else {
                            scope.model = [];
                        }
                    });
                }

                scope.clearSearch = function() {
                    scope.search.value = '';
                };
            },
            template: '<div class="item-input-wrapper">' +
                        '<i class="icon ion-android-search"></i>' +
                        '<input type="search" placeholder="{{placeholder}}" ng-model="search.value" >' +
                        '<i ng-if="search.value.length > 0" ng-click="clearSearch()" class="icon ion-close-circled"></i>' +
                      '</div>'
        };
});
