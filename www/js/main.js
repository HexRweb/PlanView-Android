$(document).ready(function(){
	window.pv = window.pv || {};
	pv.openClass = pv.openClass || function(link){window.open(link, '_system', 'location=yes')};
	pv.classClick = pv.classClick || function(e){return pv.openClass($(this).attr("data-location"));};
	pv.updateOption = pv.updateOption || function(option,value,callback){localStorage.setItem(option,value); console.log("Dun diz",localStorage.getItem(option));/* Code to update global preferences*/ callback();};
	pv.getOption = pv.getOption || function(option){return localStorage.getItem(option);};
	pv.updateLinks = pv.updateLinks || function(){let prefix="#block-";for(let i=1; i<=8;i++){$(prefix+i).attr("data-location",pv.getOption((prefix+i).replace(/#/g,"")));}};
	pv.resetNotes = pv.resetNotes || function(){localStorage.setItem("notes",JSON.stringify({1:"",2:"",3:"",4:"",5:"",6:"",7:"",8:""}))};
	pv.updateNotes = pv.updateNotes || function(){let name="block-{{ID}}-notes";for(let i=1; i<=8;i++){($("#"+name.replace(/{{ID}}/g,i)).val(pv.getNote(i)))}};
	pv.getNote = pv.getNote || function(note){let json = JSON.parse(localStorage.getItem("notes")); return (json[note]) ? json[note] : ""};
	pv.saveNote = pv.saveNote || function(which,what){let json = JSON.parse(localStorage.getItem("notes")); json[which] = what; localStorage.setItem("notes",JSON.stringify(json))};
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
