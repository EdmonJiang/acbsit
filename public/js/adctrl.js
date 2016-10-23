var adApp = angular.module('staffApp', []);

adApp.controller('adCtrl', ['$scope', '$http', 
	function($scope, $http){
		$scope.userInfo = {}
		$scope.username = ""
		$scope.errMsg = {
			text: "",
			class: "text-danger"};
		$scope.submitInfo = function () {
			var queryname = $scope.username;
			$scope.errMsg.text = "Searching ...";
			$scope.errMsg.class = "text-muted";
			if(queryname){
				console.log(queryname);
				getby_email(queryname);
				
			}else{
				$scope.errMsg.text = "Please enter your query!";
				$scope.errMsg.class = "text-danger";
			}
		}

		var getby_email = function(name){
		    //console.log($scope.contact);
		    $http.get('http://nanjingit.apac.group.atlascopco.com/?name='+name).success(function(response){
		        console.log(response)
		        if (response.error) {
		        	$scope.errMsg.text = response.error;
		        	$scope.errMsg.class = "text-danger";
		        }else{
		        	$scope.userInfo = response;
		        	$scope.errMsg.text = '1 record found for "'+name+'".';
		        }
		        // if(response[0]){
			       //  $scope.users = response;
			       //  $scope.errMsg.text = response.length + ' records found.';
			       //  $scope.errMsg.class = "text-success"
			       //  //console.log($scope.users);
		        // }else{
		        // 	$scope.errMsg.text = "Nothing Found!";
		        // 	$scope.errMsg.class = "text-danger";
		        // }
		    });
		};

	}
])
