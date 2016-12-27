(function () {
	'use strict';

	angular.module('staffApp', [])
		.controller('awCtrl', ['$scope', '$http', 
			function($scope, $http){
				$scope.users = [];
				$scope.count = 0;
				var get_users = function(q){
				    //console.log($scope.contact);
				    $http.post('/cmdb/airwatch/', q).success(function(response){
				        //console.log(response)
				        if (response.error) {
				        	$scope.errMsg.text = response.error;
				        	$scope.errMsg.class = "text-danger";
				        }else{
				        	console.log(response)
				        	$scope.users = response.data;
				        	$scope.count = response.count;
				        }

				    });
				};

				get_users({Company: 'CJA'})
			}
		])

})();
