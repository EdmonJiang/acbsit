$(function () {
    (function ($) {
        $("input:radio").on("click", function () {
            var tip = $(this).attr("title");
            $("#qword").attr("placeholder", tip);
        })

        $("#txtFilter").keyup(function(e){
            var keyword = $(this).val();
            if( keyword != ""){
                var reg = new RegExp(keyword, 'i');
                $('#table-detail tr').hide().filter(function(){return $(this).text().match(reg)}).show();
                }else{
                $('#table-detail tr').show();
                }
        })

    })(jQuery);
});

(function ($) {
    'use strict';

    angular.module('staffApp', [])
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
                        if (data.value.match(/\w/g).length < 3) {
                            $scope.errMsg.text = "At least enter 3 letters!";
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
                    var url, fields, cb;
                    switch(flag){
                        case 'PC':
                            url = "/cmdb/symantec/altiris/"+query[0]+"?"+"domain="+query[1]+"&user="+query[2];
                            fields = ['SW Name', 'Version', 'Publisher', 'InstallDate'];
                            cb = null;
                            break;
                        case 'User':
                            url = "/?name="+query[0];
                            fields = ['sAMAccountName', 'cn', 'description', 'mail', 'userPrincipalName', 'telephoneNumber', 'title', 'department', 'company', 'manager', 'location', 'accountStatus', 'dn', 'whenCreated', 'whenChanged', 'lastLogged'];
                            cb = null;
                            break;
                        case 'SN':
                            url = "/cmdb/warranty/dell?sn="+query[0];
                            fields = ['ServiceLevelDescription', 'StartDate', 'EndDate'];
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
                            $('#symModalLabel').text(flag + ' Details - '+ query[0]);
                            $('#txtFilter').val("");
                            $('#table-detail').html('No '+ flag +' information found!');
                            $('#sym-modal').modal({ keyboard: true });
                            $scope.searching = false;
                        } else {
                            //console.log(response)
                            var data = response.data;
                            $('#table-detail').html("");
                            $('#txtFilter').val("");
                            $('#symModalLabel').text(flag + ' Details - '+ query[0]);
                            json2table("table-detail", data, fields, cb);
                            $('#sym-modal').modal({ keyboard: true });
                            $('#sym-modal').on('shown.bs.modal', function () {
                               $("#txtFilter").focus()
                            })
                        }
                        $scope.searching = false;

                    }, function(response) {
                        //console.log("数据加载失败")
                        $('#symModalLabel').text(flag + ' Details - '+ query[0]);
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

})(jQuery);
