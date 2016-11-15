var iptApp = angular.module('staffApp', ['ngSanitize']);

iptApp.controller('iptCtrl', ['$scope', '$http', '$sce',
	function($scope, $http, $sce){
		$scope.userInfo = ""
		$scope.email = ""
		$scope.searching = false;
		$scope.errMsg = {
			text: "",
			class: "text-danger"};
		$scope.submitInfo = function () {
			var queryname = $scope.email;
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

		var getby_email = function(email){
		    //console.log($scope.contact);
		    $http.post('/cmdb/ipt', {email: email}).success(function(response){
		        //console.log(response)
		        if (response==="error" || response==="") {
		        	$scope.errMsg.text = "Error occurred!";
		        	$scope.errMsg.class = "text-danger";
		        }else{
		        	$scope.userInfo = $sce.trustAsHtml(response);
		        	//console.log(response)
		        	var tr = response.match(/<tr.*?(?=>)(.|\n)*?<\/tr>/g);
		        	$scope.errMsg.text = (tr?tr.length:0) +' records found for "'+email+'".';
		        }
		        $scope.searching = false;
		    });
		};

	}
])
