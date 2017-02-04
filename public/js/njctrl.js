(function($, angular) {
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
                //console.log(data);
                $http.get('/cmdb/staff/users', {params: data}).then(function(response) {
                    var data = response.data;
                    //console.log(data);
                    if (data.error) {
                        $scope.errMsg.text = data.error;
                        $scope.errMsg.class = "text-danger";
                    }
                    else if (Array.isArray(data) && data.length > 0) {
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
            $scope.userInfo = "";
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
                        $scope.errMsg.text = 'User found for "' + name + '".';
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
                var queryname = $scope.email.trim();
                $scope.errMsg.text = "Searching ...";
                $scope.errMsg.class = "text-muted";
                if (queryname) {
                    //console.log(queryname);
                    if(queryname.indexOf(" ") !== -1){
                        queryname = queryname.replace(/\ /g, '.');
                    }
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
        $scope.userInfoArr = ['Group','FirstName','LastName','Email','ContactNumber','Status','EnrolledDevicesCount','LastScanned'];

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
                        $scope.userInfoArr.forEach(function (item) {
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
    .controller('symCtrl', ['$scope', '$http',
        function ($scope, $http) {
            $scope.users = [];
            $scope.searching = false;
            $scope.curPage = 0;
            $scope.showPage = [1];
            $scope.totalPage = 0;
            $scope.errMsg = {
                text: "",
                class: "text-danger"
            };
            $scope.form = {
                key: "pcname",
                value: ""
            }
            $scope.submitInfo = function () {
                var data = {
                    key: $scope.form.key || "pcname",
                    value: $scope.form.value.trim()
                }
                $scope.errMsg.text = "Searching ...";
                $scope.errMsg.class = "text-muted";
                if (data.value) {
                    //console.log(data);
                    if (data.value.match(/\w/g).length < 4) {
                        $scope.errMsg.text = "Please enter at least 4 letters!";
                        $scope.errMsg.class = "text-danger";
                        return;
                    }
                    $scope.searching = true;
                    get_data(data);
                } else {
                    $scope.errMsg.text = "Please enter your query!";
                    $scope.errMsg.class = "text-danger";
                }
            }

            var get_data = function (data) {
                //console.log(data);
                $http.get('/cmdb/symantec/altiris?' + data.key + '=' + data.value).then(function (response) {

                    if (response.data.error) {
                        $scope.errMsg.text = response.data.error;
                        $scope.errMsg.class = "text-danger";
                        $scope.searching = false;
                    } else {
                        $scope.totalUsers = response.data;
                        var count = $scope.totalUsers.length;
                        if (count < 1) {
                            $scope.errMsg.text = "Nothing Found!";
                            $scope.errMsg.class = "text-danger";
                            $scope.searching = false;
                            return;
                        }
                        $scope.users = $scope.totalUsers.slice(0, 10);
                        var totalPage = Math.ceil(count / 10);
                        $scope.totalPage = totalPage;
                        $scope.errMsg.text = count + ' records found.';
                        $scope.curPage = 1;
                        $scope.showPage = GetPager(1, totalPage);
                        $scope.errMsg.class = "text-success";
                        //console.log($scope.users);
                        //console.log("totalPage: ",totalPage);
                        $scope.searching = false;
                    }

                }, function (response) {
                    $scope.errMsg.text = "Failed to get data!";
                    $scope.errMsg.class = "text-danger";
                    $scope.searching = false;
                });
            };

            $scope.get_page = function (page) {
                //console.log("get page: ",page)
                if (page < 1 || $scope.curPage === page || page > $scope.totalPage) {
                    return;
                } else {
                    $scope.curPage = page;
                    $scope.users = $scope.totalUsers.slice((page-1) * 10, page * 10);
                    $scope.showPage = GetPager(page, $scope.totalPage)
                }
            }

            $scope.export2csv = function (data) {
                var csv = jsonTocsv(data,['PC Name', 'Primary User', 'PC Domain', 'OS Name', 'Computer Model', 'Serial Number', 'TPM Activated', 'Encryption Status', 'IP Address', 'Last Connected']);
                if(!csv){return;}
                
                var fileName = $scope.form.value.replace(/(\/)|(\\)|(\*)|(\?)|(\<)|(\>)|(\")/g,'') + '.csv';
                // create the blob
                var blob = new Blob([csv]);
                if(window.navigator.msSaveOrOpenBlob){
                    window.navigator.msSaveOrOpenBlob(blob, fileName);
                    return;
                }
                // create the URL
                window.URL = window.URL || window.webkiURL;
                var blobURL = window.URL.createObjectURL(blob);

                // add the download link
                //$(this).append("<a class='table_download_csv_link' href='"+blobURL+"' download='"+fileName+"' export_id='"+export_id+"'>"+settings.linkname+"</a>");
                var a = document.createElement("a");
                a.download = fileName;
                a.href = blobURL;

                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
            }

            $scope.getDetails = function (query, flag) {
                //console.log(query)
                if(!Array.isArray(query) || !flag){
                    return;
                }
                var url, fields, cb, title;
                switch(flag){
                    case 'PC':
                        url = "/cmdb/symantec/altiris/"+query[0]+"?"+"domain="+query[1]+"&user="+query[2];
                        fields = ['SW Name', 'Version', 'Publisher', 'InstallDate'];
                        title = "Installed Software List - ";
                        cb = null;
                        break;
                    case 'User':
                        url = "/?name="+query[0];
                        fields = ['sAMAccountName', 'cn', 'description', 'mail', 'userPrincipalName', 'telephoneNumber', 'title', 'manager', 'department', 'company', 'location', 'accountStatus', 'whenCreated', 'whenChanged', 'lastLogged'];
                        title = "AD User Information - ";
                        cb = null;
                        break;
                    case 'SN':
                        url = "/cmdb/warranty/dell?sn="+query[0];
                        fields = ['ServiceLevelDescription', 'StartDate', 'EndDate'];
                        title = "DELL Warranty Information - ";
                        cb = formatSNDate;
                        break;
                    default:
                        return;
                }
                //console.log(url);
                $scope.searching = true;
                $http.get(url).then(function(response) {
                    //console.log(response)
                    if (response.data.error) {
                        //$scope.users = [{ Email: response.data.error }];
                        $('#symModalLabel').text(title+ query[0]);
                        $('#txtFilter').val("");
                        $('#table-detail').html('No '+ flag +' information found!');
                        $('#sym-modal').modal({ keyboard: true });
                        $scope.searching = false;
                    } else {
                        //console.log(response)
                        var data = response.data;
                        $('#table-detail').html("");
                        $('#txtFilter').val("");
                        $('#symModalLabel').text(title+ query[0]);
                        json2table("table-detail", data, fields, cb);
                        $('#sym-modal').modal({ keyboard: true });
                        $('#sym-modal').on('shown.bs.modal', function () {
                           $("#txtFilter").focus()
                        })
                    }
                    $scope.searching = false;

                }, function(response) {
                    //console.log("数据加载失败")
                    $('#symModalLabel').text(title+ query[0]);
                    $('#txtFilter').val("");
                    $('#table-detail').html('No '+ flag +' information found!');
                    $('#sym-modal').modal({ keyboard: true });
                    $scope.searching = false;
                });
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

    function jsonTocsv(data, fields) {

        if (data && fields && Array.isArray(data) && Array.isArray(fields)) {
            var csv = "\ufeff" + fields.toString() + "\r\n";
            data.forEach(function (item) {
                var del = "";

                fields.forEach(function (i) {
                    csv += del + (item[i] || "");
                    del = ",";
                })

                csv += "\r\n";
            })

            return csv;

        } else {
            return false;
        }

    }

    function  json2table(tableId, data, fields ,callback){

        var divTable = document.getElementById(tableId);

        if(!divTable){return;}

        if(Array.isArray(fields) && fields.length>0){
            //data.sort(function(a,b){return a.total - b.total});
            
            var tbl_body = document.createElement('tbody');
            
            // Object to vertical table
            if($.isPlainObject(data)){

                fields.forEach(function (v) {
                    var tbl_row = tbl_body.insertRow();
                    tbl_row.appendChild(document.createElement('th')).append(v)

                    tbl_row.insertCell(1).append(data[v]);
                })
                
                divTable.appendChild(tbl_body);
            } else if(Array.isArray(data) && data.length>0){
                // Array to horizontal table
                // create thead
                var tbl_head = document.createElement('thead');
                var tbl_row = tbl_head.insertRow();
                
                fields.forEach(function(v){
                    tbl_row.appendChild(document.createElement('th')).append(v);;
                })

                tbl_head.appendChild(tbl_row);
                // create tbody
                $.each(data, function(key, v){
                    var tbl_row = tbl_body.insertRow();
                    
                    fields.forEach(function(title){
                        tbl_row.insertCell().append(v[title]);
                    })
                })
                
                if(callback){
                    callback(tbl_body);
                }
                
                divTable.appendChild(tbl_head);
                divTable.appendChild(tbl_body);
            } else {
                return;
            }
                        
        }
    }

    function formatSNDate(tbl_body){
        var trs = tbl_body.getElementsByTagName("tr");
        for(var i=0,len=trs.length;i<len;i++){
            trs[i].getElementsByTagName("td")[1].innerHTML = (new Date(trs[i].getElementsByTagName("td")[1].innerHTML)).toLocaleDateString();
            trs[i].getElementsByTagName("td")[2].innerHTML = (new Date(trs[i].getElementsByTagName("td")[2].innerHTML)).toLocaleDateString();
        }
    }
})(jQuery, angular);
