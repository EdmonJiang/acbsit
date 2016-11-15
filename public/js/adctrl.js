var adApp = angular.module('staffApp', []);

adApp.controller('adCtrl', ['$scope', '$http', 
	function($scope, $http){
		$scope.userInfo = {};
		$scope.username = "";
		$scope.searching = false;
		$scope.errMsg = {
			text: "",
			class: "text-danger"};
		$scope.submitInfo = function () {
			var queryname = $scope.username;
			$scope.errMsg.text = "Searching ...";
			$scope.errMsg.class = "text-muted";
			if(queryname){
				//console.log(queryname);
				$scope.searching = true;
				getby_email(queryname);
				
			}else{
				$scope.errMsg.text = "Please enter your query!";
				$scope.errMsg.class = "text-danger";
			}
		}

		var getby_email = function(name){
		    //console.log($scope.contact);
		    $http.get('http://nanjingit.apac.group.atlascopco.com/?name='+name).success(function(response){
		        //console.log(response)
		        if (response.error) {
		        	$scope.errMsg.text = response.error;
		        	$scope.errMsg.class = "text-danger";
		        }else{
		        	$scope.userInfo = response;
		        	$scope.errMsg.text = '1 record found for "'+name+'".';
		        }
		        $scope.searching = false;
		    });
		};

	}
])
