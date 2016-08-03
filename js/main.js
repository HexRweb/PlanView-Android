$(document).ready(function(){
	window.pv = window.pv || {};
	pv.openClass = pv.openClass || function(link){window.open(link, '_system', 'location=yes')};
	pv.classClick = pv.classClick || function(e){return pv.openClass($(this).attr("data-location"));};
	pv.updateOption = pv.updateOption || function(option,value,callback){localStorage.setItem(option,value); console.log("Dun diz",localStorage.getItem(option));/* Code to update global preferences*/ callback();};
	pv.getOption = pv.getOption || function(option){return localStorage.getItem(option);};
	pv.updateLinks = pv.updateLinks || function(){let prefix="#block-";for(let i=1; i<=8;i++){$(prefix+i).attr("data-location",pv.getOption((prefix+i).replace(/#/g,"")));}};
	$(".class").click(pv.classClick);
	$('.button-collapse').sideNav();
	pv.updateLinks();
});

/*document.getElementById("demo").addEventListener("click", myFunction);
function myFunction() {
    var x = document.getElementById("2nd").innerHTML;
    var 2a = 'onclick="window.open(''
    var 2b = '', '_system', 'location=yes');">'
    var 2total = 2a+x+2b;
    document.getElementById("2ndp").innerHTML = 2total;
}*/
