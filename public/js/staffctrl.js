var staffApp = angular.module('staffApp', []);

staffApp.controller('staffCtrl', ['$scope', '$http', 
	function($scope, $http){
		$scope.users = [];
		$scope.searching = false;
		$scope.errMsg = {
			text: "",
			class: "text-danger"};
		$scope.form = {
			key: "AdMail",
			value: ""
		}
		$scope.submitInfo = function () {
			var data = {
				key: $scope.form.key || "AdMail",
				value: $scope.form.value.trim()
			}
			$scope.errMsg.text = "Searching ...";
			$scope.errMsg.class = "text-muted";
			if(data.value){
				//console.log(data);
				if(data.key==="ManagerMail"){
					$scope.searching = true;
					getby_manageremail(data);
				}
				else{
					$scope.searching = true;
					getby_email(data);
				}
			}else{
				$scope.errMsg.text = "Please enter your query!";
				$scope.errMsg.class = "text-danger";
			}
		}

		var getby_email = function(data){
		    //console.log($scope.contact);
		    $http.get('https://ssiscndb0018.apac.group.atlascopco.com/mds/staffs?'+data.key+'='+data.value).success(function(response){
		        
		        if(response[0]){
			        $scope.users = response;
			        $scope.errMsg.text = response.length + ' records found.';
			        $scope.errMsg.class = "text-success"
			        //console.log($scope.users);
		        }else{
		        	$scope.errMsg.text = "Nothing Found!";
		        	$scope.errMsg.class = "text-danger";
		        }
		        $scope.searching = false;
		    });
		};

		var getby_manageremail = function(data){
		    //console.log($scope.contact);
		    $http.get('https://ssiscndb0018.apac.group.atlascopco.com/mds/staffs?AdMail='+data.value).success(function(response){
		        
		        if(response[0]){
			       	mdata = {
			       		key: "GuidOperationalManager",
			       		value: response[0].Guid
			       	}
			        getby_email(mdata);
		        }else{
		        	$scope.errMsg.text = "Nothing Found!";
		        	$scope.errMsg.class = "text-danger";
		        }
		    });
		};
	}
])

$(function () {
	$("input:radio").on("click", function () {
		var tip = $(this).attr("title");
		$("#qword").attr("placeholder", tip);
	})
})