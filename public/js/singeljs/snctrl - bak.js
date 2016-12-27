$(function() {
    (function() {
        $('#btnpopover').popover({
            html: true
        });
    })();
});

(function () {
	'use strict';

	var snApp = angular.module('staffApp', []);

	snApp.controller('snCtrl', ['$scope', '$http', 
		function($scope, $http){
			$scope.assetdata = "";
			$scope.assetheader = "";
			$scope.servicetag = "";
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
				}else if(/^[0-9A-Z]{7}$/.test(sn)===false){
					$scope.errMsg.text = "The service tag is invalid!";
					$scope.errMsg.class = "text-danger";
				}
				else{
					//console.log(sn);
					$scope.searching = true;
					getWarrantyBy_sn(sn);
				}
			}

			var getWarrantyBy_sn = function(sn){
			    //console.log($scope.contact);
			    $http.post('http://nanjingit.apac.group.atlascopco.com/cmdb/warranty/', {sn:sn}).success(function(response){
			        //console.log(response)
			        if (response.error) {
			        	$scope.errMsg.text = response.error;
			        	$scope.errMsg.class = "text-danger";
			        }else{
			        	$scope.assetheader = response.assetheader;
			        	$scope.assetdata = response.assetdata;
			        	$scope.errMsg.text = '1 record found for "'+sn+'".';
			        }
			        $scope.searching = false;
			    });
			};

		}
	])

})();
