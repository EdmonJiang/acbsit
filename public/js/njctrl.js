(function() {
    'use strict';

angular.module('staffApp', [])
    .config([
        '$compileProvider',
        function($compileProvider) {
            $compileProvider.aHrefSanitizationWhitelist(/^\s*(im|https?|ftp|mailto|chrome-extension):/);
            // Angular before v1.2 uses $compileProvider.urlSanitizationWhitelist(...)
        }
    ])
    .controller('staffCtrl', ['$scope', '$http',
            function($scope, $http, $compileProvider) {
                $scope.users = [];
                $scope.searching = false;
                $scope.errMsg = {
                    text: "",
                    class: "text-danger"
                };
                $scope.form = {
                    key: "name",
                    value: ""
                }

                //$compileProvider.urlSanitizationWhitelist(/^\s*(im):/);

                $scope.submitInfo = function() {
                    var data = {
                        key: $scope.form.key || "name",
                        value: $scope.form.value.trim()
                    }
                    $scope.errMsg.text = "Searching ...";
                    $scope.errMsg.class = "text-muted";
                    if (data.value) {
                        //console.log(data);
                        $scope.searching = true;
                        getby_email1(data);
                    } else {
                        $scope.errMsg.text = "Please enter your query!";
                        $scope.errMsg.class = "text-danger";
                    }
                }

                var getby_email1 = function(data) {
                    console.log(data);
                    $http.get('/cmdb/staff/users', {params: data}).then(function(response) {
                        var data = response.data;
                        //console.log(data);
                        if (data.error) {
                            $scope.errMsg.text = data.error;
                            $scope.errMsg.class = "text-danger";
                        }
                        else if (data[0]) {
                            $scope.users = data;
                            $scope.errMsg.text = data.length + ' records found.';
                            $scope.errMsg.class = "text-success"
                                //console.log($scope.users);
                        } else {
                            $scope.errMsg.text = "Nothing Found!";
                            $scope.errMsg.class = "text-danger";
                        }
                        $scope.searching = false;
                    }, function(res) {
                        $scope.errMsg.text = "Error occurred!";
                        $scope.errMsg.class = "text-danger";
                        $scope.searching = false;
                    });
                };

                var getby_email2 = function(data) {
                    $http.post('/cmdb/staff', { q: data }).then(function(res) {
                        var response = JSON.parse(res.data);
                        //console.log(response)
                        if (response.error) {
                            $scope.errMsg.text = response.error;
                            $scope.errMsg.class = "text-danger";
                            $scope.searching = false;
                        } else if(Array.isArray(response) && response.length > 0){
                            $scope.users = response;
                            $scope.errMsg.text = response.length + ' records found.';
                            $scope.errMsg.class = "text-success"
                                //console.log($scope.users);
                        } else {
                            $scope.errMsg.text = "Nothing Found!";
                            $scope.errMsg.class = "text-danger";
                        }
                        $scope.searching = false;
                    }, function (res) {
                        $scope.errMsg.text = "Failed to get data.!";
                        $scope.errMsg.class = "text-danger";
                        $scope.searching = false;
                    });
                };

            }
        ])
        .controller('adCtrl', ['$scope', '$http',
            function($scope, $http) {
                $scope.userInfo = {};
                $scope.username = "";
                $scope.searching = false;
                $scope.errMsg = {
                    text: "",
                    class: "text-danger"
                };
                $scope.submitInfo = function() {
                    var queryname = $scope.username;
                    $scope.errMsg.text = "Searching ...";
                    $scope.errMsg.class = "text-muted";
                    if (queryname) {
                        //console.log(queryname);
                        $scope.searching = true;
                        getby_email(queryname);

                    } else {
                        $scope.errMsg.text = "Please enter your query!";
                        $scope.errMsg.class = "text-danger";
                    }
                }

                var getby_email = function(name) {
                    //console.log($scope.contact);
                    $http.get('http://nanjingit.apac.group.atlascopco.com/', {params: {name: name}}).then(function(response) {
                        var data = response.data;
                        //console.log(data);
                        if ($.isEmptyObject(data)) {
                            $scope.errMsg.text = 'Nothing Found!';
                            $scope.errMsg.class = 'text-danger';
                        } else if (data.error) {
                            $scope.errMsg.text = data.error;
                            $scope.errMsg.class = 'text-danger';
                        } else {
                            $scope.userInfo = data;
                            $scope.errMsg.class = 'text-success';
                            $scope.errMsg.text = '1 record found for "' + name + '".';
                        }
                        $scope.searching = false;
                    }, function (response) {
                        $scope.errMsg.text = 'Failed to get data!';
                        $scope.errMsg.class = 'text-danger';
                        $scope.searching = false;
                    });
                };

            }
        ])
        .controller('iptCtrl', ['$scope', '$http', '$sce',
            function($scope, $http, $sce) {
                $scope.userInfo = ""
                $scope.email = ""
                $scope.searching = false;
                $scope.errMsg = {
                    text: "",
                    class: "text-danger"
                };
                $scope.submitInfo = function() {
                    var queryname = $scope.email;
                    $scope.errMsg.text = "Searching ...";
                    $scope.errMsg.class = "text-muted";
                    if (queryname) {
                        //console.log(queryname);
                        $scope.searching = true;
                        getby_email(queryname);

                    } else {
                        $scope.errMsg.text = "Please enter your query!";
                        $scope.errMsg.class = "text-danger";
                    }
                }

                var getby_email = function(email) {
                    //console.log($scope.contact);
                    $http.post('/cmdb/ipt', { email: email }).then(function(response) {
                        var data = response.data;
                        //console.log(data);
                        if (data === "error" || data === "") {
                            $scope.errMsg.text = "Error occurred!";
                            $scope.errMsg.class = "text-danger";
                        } else {
                            $scope.userInfo = $sce.trustAsHtml(data);
                            //console.log(data)
                            var tr = data.match(/<tr.*?(?=>)(.|\n)*?<\/tr>/g);
                            $scope.errMsg.class = "text-success";
                            $scope.errMsg.text = (tr ? tr.length : 0) + ' records found for "' + email + '".';
                        }
                        $scope.searching = false;
                    }, function (response) {
                        $scope.errMsg.text = 'Failed to get data!';
                        $scope.errMsg.class = 'text-danger';
                        $scope.searching = false;
                    });
                };

            }
        ])
        .controller('snCtrl', ['$scope', '$http',
            function($scope, $http) {
                $scope.assetdata = "";
                $scope.assetheader = "";
                $scope.servicetag = "";
                $scope.searching = false;
                $scope.errMsg = {
                    text: "",
                    class: "text-danger"
                };
                $scope.submitInfo = function() {
                    var sn = angular.uppercase($scope.servicetag);
                    $scope.errMsg.text = "Searching ...";
                    $scope.errMsg.class = "text-muted";
                    if (!sn) {
                        $scope.errMsg.text = "Please enter your query!";
                        $scope.errMsg.class = "text-danger";
                    } else if (/^[0-9A-Z]{7}$/.test(sn) === false) {
                        $scope.errMsg.text = "The service tag is invalid!";
                        $scope.errMsg.class = "text-danger";
                    } else {
                        //console.log(sn);
                        $scope.searching = true;
                        getWarrantyBy_sn(sn);
                    }
                }

                var getWarrantyBy_sn = function(sn) {
                    //console.log($scope.contact);
                    $http.post('http://nanjingit.apac.group.atlascopco.com/cmdb/warranty/', { sn: sn }).then(function(response) {
                        var data = response.data;
                        //console.log(response)
                        if (data.error) {
                            $scope.errMsg.text = data.error;
                            $scope.errMsg.class = "text-danger";
                        } else {
                            $scope.assetheader = data.assetheader;
                            $scope.assetdata = data.assetdata;
                            $scope.errMsg.class = "text-success";
                            $scope.errMsg.text = '1 record found for "' + sn + '".';
                        }
                        $scope.searching = false;
                    }, function (response) {
                        $scope.errMsg.text = 'Failed to get data!';
                        $scope.errMsg.class = 'text-danger';
                        $scope.searching = false;
                    });
                };

            }
        ])
        .controller('thinkCtrl', ['$scope', '$http',
            function($scope, $http) {
                $scope.assets = {};
                $scope.searching = false;
                $scope.errMsg = {
                    text: "",
                    class: "text-danger"
                };
                $scope.submitInfo = function() {
                    var sn = angular.uppercase($scope.servicetag);
                    $scope.errMsg.text = "Searching ...";
                    $scope.errMsg.class = "text-muted";
                    if (!sn) {
                        $scope.errMsg.text = "Please enter your query!";
                        $scope.errMsg.class = "text-danger";
                    } else {
                        //console.log(sn);
                        $scope.searching = true;
                        getWarrantyBy_sn(sn);
                    }
                }

                var getWarrantyBy_sn = function(sn) {
                    //console.log($scope.contact);
                    $http.post('http://nanjingit.apac.group.atlascopco.com/cmdb/thinkpad/', { sn: sn }).then(function(response) {
                        var data = response.data;
                        //console.log(response)
                        if (data.error) {
                            $scope.errMsg.text = 'No information found for "' + sn + '".';
                            //$scope.errMsg.text = data.error;
                            $scope.errMsg.class = "text-danger";
                        } else {
                            $scope.assets = data;
                            $scope.errMsg.class = "text-success";
                            $scope.errMsg.text = '1 record found for "' + sn + '".';
                        }
                        $scope.searching = false;
                    }, function (response) {
                        $scope.errMsg.text = 'Failed to get data!';
                        $scope.errMsg.class = 'text-danger';
                        $scope.searching = false;
                    });
                };

            }
        ])

})();
