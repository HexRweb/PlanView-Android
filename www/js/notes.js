$(document).ready(function()
{
	$(".btn-save").click(function(){});
	localStorage.getItem("notes") != null ? pv.updateNotes() :	localSotrage.setItem("notes",JSON.stringify([]));
})