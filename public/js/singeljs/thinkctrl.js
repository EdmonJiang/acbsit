(function () {
	'use strict';
	var thinkApp = angular.module('staffApp', []);

	thinkApp.controller('thinkCtrl', ['$scope', '$http', 
		function($scope, $http){
			$scope.assets = {};
			$scope.searching = false;
			$scope.errMsg = {
				text: "",
				class: "text-danger"};
			$scope.submitInfo = function () {
				var sn = angular.uppercase($scope.servicetag);
				$scope.errMsg.text = "Searching ...";
				$scope.errMsg.class = "text-muted";
				if(!sn){
					$scope.errMsg.text = "Please enter your query!";
					$scope.errMsg.class = "text-danger";
				} else {
					//console.log(sn);
					$scope.searching = true;
					getWarrantyBy_sn(sn);
				}
			}

			var getWarrantyBy_sn = function(sn){
			    //console.log($scope.contact);
			    $http.post('http://nanjingit.apac.group.atlascopco.com/cmdb/thinkpad/', {sn:sn}).success(function(response){
			        //console.log(response)
			        if (response.error) {
			        	$scope.errMsg.text = 'No information found for "'+sn+'".';
			        	//$scope.errMsg.text = response.error;
			        	$scope.errMsg.class = "text-danger";
			        }else{
			        	$scope.assets = response;
			        	$scope.errMsg.text = '1 record found for "'+sn+'".';
			        }
			        $scope.searching = false;
			    });
			};

		}
	])
})();