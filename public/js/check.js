$(function(){
	(function () {
	'use strict';
		$("#site-form").submit(function(event){
			var q = $("#qword").val().trim();
			if(q===""){
				$("#siteinfo").html("<h5 style='color:red'>Please enter a keyword in the textbox!</h5>");
				event.preventDefault();
			}
		})

		$("input:radio").on("click", function () {
			var tip = $(this).attr("title");
			$("#qword").attr("placeholder", tip);
		})

	})();
})