(function() {
    'use strict';

    var userInfoArr = ['Group','FirstName','LastName','Email','ContactNumber','Status','EnrolledDevicesCount','LastScanned'];

    angular.module('staffApp', [])
        .controller('awCtrl', ['$scope', '$http',
            function($scope, $http) {
                $scope.users = [];
                $scope.count = 0;
                $scope.curPage = 0;
                $scope.totalPage = 0;
                $scope.showPage = [1];
                $scope.sort = "e";
                $scope.isLoading = true;
                $scope.q = {
                    famcode: "",
                    company: "",
                    country: "",
                    email: "",
                    enrolled: "True",
                    count: "",
                };

                $scope.Search = function() {
                    //console.log($scope.q)
                    $scope.get_users(1)
                }

                $scope.Sort = function (sort) {
                	console.log(sort)
                	switch(sort){
                		case "e":
                			$scope.sort = $scope.sort === "e" ? "ed" : "e";
                			$scope.get_users($scope.curPage);
                			break;
                		case "s":
                			$scope.sort = $scope.sort === "s" ? "sd" : "s";
                			$scope.get_users($scope.curPage);
                			break;
                		case "f":
                			$scope.sort = $scope.sort === "f" ? "fd" : "f";
                			$scope.get_users($scope.curPage);
                			break;
                		case "c":
                			$scope.sort = $scope.sort === "c" ? "cd" : "c";
                			$scope.get_users($scope.curPage);
                			break;
                	}
                }

                $scope.Clear = function () {
                	$scope.q = {
	                    famcode: "",
	                    company: "",
	                    country: "",
	                    email: "",
	                    enrolled: "True",
	                    count: "",
                	}
                }
                $scope.get_users = function(page) {

                    $scope.curPage = page;
                    var params = {
                        "q[famcode]": $scope.q.famcode,
                        "q[company]": $scope.q.company,
                        "q[country]": $scope.q.country,
                        "q[email]": $scope.q.email,
                        "q[enrolled]": $scope.q.enrolled,
                        "q[count]": $scope.q.count,
                        page: page ? page : 1,
                        sort: $scope.sort
                    };
                    //console.log(params)
                    $scope.isLoading = true;
                    $http.get('/cmdb/airwatch/invoice', { params: params }).then(function(response) {
                        //console.log(response)
                        if (response.data.error) {
                            $scope.users = [{ country: response.data.error }];
                            $scope.isLoading = false;
                        } else {
                            //console.log(response)
                            var data = response.data;
                            $scope.users = data.data;
                            $scope.count = data.count;
                            var total = data.totalPage;
                            $scope.totalPage = total;
                            $scope.showPage = GetPager(page, total);
                        }
                        $scope.isLoading = false;

                    }, function(response) {
                        //console.log("数据加载失败")
                        $scope.users = [{ country: "Failed to load data ..." }];
                        $scope.isLoading = false;
                    });
                };

                $scope.get_users(1);

                $scope.getUserDetail = function (email) {

                	$scope.isLoading = true;
                	$http.get('/cmdb/airwatch/user', { params: {email: email} }).then(function(response) {
                        //console.log(response)
                        if (response.data.error) {
                            //$scope.users = [{ Email: response.data.error }];
                            $('#awModalLabel').text('User Details - '+email);
                            $('#table-detail').html('No User information found!');
                            $('#aw-modal').modal({ keyboard: true });
                            $scope.isLoading = false;
                        } else {
                            //console.log(response)
                            var data = response.data;
                            var detail = "";
                            userInfoArr.forEach(function (item) {
                            	detail += "<tr><th>"+item+"</th><td>"+data[item]+"</td>";
                            })
                            $('#table-detail').html(detail);
                            $('#awModalLabel').text('User Details - '+email);
                            $('#aw-modal').modal({ keyboard: true });
                        }
                        $scope.isLoading = false;

                    }, function(response) {
                        //console.log("数据加载失败")
                        $('#awModalLabel').text('User Details - '+email);
                        $('#table-detail').html('No User information found!')
                        $('#aw-modal').modal({ keyboard: true });
                        $scope.isLoading = false;
                    });
                }

                $scope.get_page = function(page) {
                    //console.log(page)
                    if (page < 1 || $scope.curPage === page || page > $scope.totalPage) {
                        return;
                    } else {

                        $scope.get_users(page, $scope.q, $scope.sort)
                    }
                }

            }
        ])

    function GetPager(currentPage, totalPages) {
        // default to first page
        currentPage = currentPage || 1;

        var startPage, endPage;
        if (totalPages <= 10) {
            // less than 10 total pages so show all
            startPage = 1;
            endPage = totalPages;
        } else {
            // more than 10 total pages so calculate start and end pages
            if (currentPage <= 6) {
                startPage = 1;
                endPage = 10;
            } else if (currentPage + 4 >= totalPages) {
                startPage = totalPages - 9;
                endPage = totalPages;
            } else {
                startPage = currentPage - 5;
                endPage = currentPage + 4;
            }
        }

        return range(startPage, endPage + 1);
    }

    function range(start, end) {
        start = +start || 0;

        if (end == null) {
            end = start;
            start = 0;
        }

        var step = 1,
            index = -1;
        var length = Math.max(0, Math.ceil((end - start) / step)),
            result = Array(length);

        while (++index < length) {
            result[index] = start;
            start += step;
        }
        return result;
    }

})();
