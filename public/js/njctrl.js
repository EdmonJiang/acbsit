(function() {
    'use strict';

    angular.module('staffApp', [])
        .controller('staffCtrl', ['$scope', '$http',
            function($scope, $http) {
                $scope.users = [];
                $scope.searching = false;
                $scope.errMsg = {
                    text: "",
                    class: "text-danger"
                };
                $scope.form = {
                    key: "AdMail",
                    value: ""
                }
                $scope.submitInfo = function() {
                    var data = {
                        key: $scope.form.key || "AdMail",
                        value: $scope.form.value.trim()
                    }
                    $scope.errMsg.text = "Searching ...";
                    $scope.errMsg.class = "text-muted";
                    if (data.value) {
                        //console.log(data);
                        $scope.searching = true;
                        getby_email2(data);
                    } else {
                        $scope.errMsg.text = "Please enter your query!";
                        $scope.errMsg.class = "text-danger";
                    }
                }

                var getby_email2 = function(data) {
                    $http.post('/cmdb/staff', { q: data}).success(function(res) {
                        var response = JSON.parse(res)
                        if (response[0]) {
                            $scope.users = response;
                            $scope.errMsg.text = response.length + ' records found.';
                            $scope.errMsg.class = "text-success"
                                //console.log($scope.users);
                        } else {
                            $scope.errMsg.text = "Nothing Found!";
                            $scope.errMsg.class = "text-danger";
                        }
                        $scope.searching = false;
                    });
                };

            }
        ])
        .controller('adCtrl', ['$scope', '$http', 
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
                            $scope.errMsg.class = "text-success";
                            $scope.errMsg.text = '1 record found for "'+name+'".';
                        }
                        $scope.searching = false;
                    });
                };

            }
        ])
        .controller('iptCtrl', ['$scope', '$http', '$sce',
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
                            $scope.errMsg.class = "text-success";
                            $scope.errMsg.text = (tr?tr.length:0) +' records found for "'+email+'".';
                        }
                        $scope.searching = false;
                    });
                };

            }
        ])
        .controller('snCtrl', ['$scope', '$http', 
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
                            $scope.errMsg.class = "text-success";
                            $scope.errMsg.text = '1 record found for "'+sn+'".';
                        }
                        $scope.searching = false;
                    });
                };

            }
        ])
        .controller('thinkCtrl', ['$scope', '$http', 
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
                            $scope.errMsg.class = "text-success";
                            $scope.errMsg.text = '1 record found for "'+sn+'".';
                        }
                        $scope.searching = false;
                    });
                };

            }
        ])

})();
