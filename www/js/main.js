/*Make sure the PlanView object is initialized before doing anything*/
console.log("Main.js");
window.pv = window.pv || {};
pv.openClass = pv.openClass || function(link){window.open(link, '_system', 'location=yes')};
pv.classClick = pv.classClick || function(e){return pv.openClass($(this).attr("data-location"));};
pv.updateOption = pv.updateOption || function(option,value,callback)
{
	localStorage.setItem(option,value);
	console.log("Update option called",option,value,callback);/* Code to update global preferences*/
	if(typeof callback === "function") callback();
};
pv.getOption = pv.getOption || function(option){return localStorage.getItem(option);};
pv.updateLinks = pv.updateLinks || function()
{
	var prefix="#block-";
	for(var i=1; i<=8;i++)
	{
		$(prefix+i).attr("data-location",pv.getOption((prefix+i).replace(/#/g,"")));
	}
};
pv.resetNotes = pv.resetNotes || function(){pv.updateOption("notes",JSON.stringify({1:"",2:"",3:"",4:"",5:"",6:"",7:"",8:""}),function(){})};
pv.updateNotes = pv.updateNotes || function(){var name="block-{{ID}}-notes";for(var i=1; i<=8;i++){($("#"+name.replace(/{{ID}}/g,i)).val(pv.getNote(i)))}};
pv.getNote = pv.getNote || function(note){var json = JSON.parse(pv.getOption("notes")); return (json[note]) ? json[note] : ""};
pv.saveNote = pv.saveNote || function(which,what)
{
	console.log("SaveNote Called",which,what);
	var json = JSON.parse(pv.getOption("notes"));
	if(json[which] !== what)
	{
		json[which] = what;
		pv.updateOption("notes",JSON.stringify(json))
		return true;
	}
	else return false;
};
$(".class").click(pv.classClick);
$('.button-collapse').sideNav();
pv.updateLinks();


/*Index Functions*/

$(".btn-save").click(function()
{
	console.log("btn-save clicked");
	var block = $(this).attr("data-block");
	//console.log(block,$("#block-"+block+"-notes").val());
	if(pv.saveNote(block,$("#block-"+block+"-notes").val()))
		Materialize.toast("Saved",5000);
});
console.log(pv.getOption("autosave"));
if(pv.getOption("autosave") == true)
{
	$(".materialize-textarea").change(function(){
		console.log("materialize-textarea change called");
		var block = $(this).attr("data-block");
		//console.log(block,$(this).val());
		if(pv.saveNote(block,$(this).val()))
			Materialize.toast("Saved",5000);
	});
	$(".materialize-textarea").focusout(function(){
		console.log("materialize-textarea focusout called");
		var block = $(this).attr("data-block");
		//console.log(block,$(this).val());
		if(pv.saveNote(block,$(this).val()))
			Materialize.toast("Saved",5000);
	});
}
if(localStorage.getItem("notes") == null) pv.resetNotes(); //Ensures that the notes start out ready.
pv.updateNotes();

/*Settings Functions*/

$("#demo").click(function(e){
	console.log("Demo clicked");
	e.preventDefault();
	var prefix="#block-",el=prefix + "{{ID}}-link", newLinks = [];
	for(var i = 1; i <= 8 ; i++)
	{
		var valid = $(el.replace(/{{ID}}/g,i))[0].checkValidity() && $(el.replace(/{{ID}}/g,i)).val() != "";
		if(valid)
			newLinks.push($(el.replace(/{{ID}}/g,i)).val());
		else
		{
			$(el.replace(/{{ID}}/g,i)).addClass("invalid");
			Materialize.toast("There was an error",5000);
			return false;
		}

	}
	for(var i =0 ; i <= 7 ; i++)
	{
		var j=i+1
		pv.updateOption((prefix+j).replace(/#/g,""),newLinks[i],function(){$(prefix+j).attr("data-location",newLinks[i])});
	}
	pv.updateOption("autosave",$("#autosave").is(":checked"),function(){});
	Materialize.toast("Settings saved!",5000);
});

function updateInputs()
{
	var prefix="#block-";for(var i=1; i<=8;i++){$(prefix+i+"-link").val(pv.getOption((prefix+i).replace(/#/g,"")));}
}

/*document.ready functions*/
$('.modal-trigger').leanModal();
$('.button-collapse').sideNav();
updateInputs()
$("#loading").hide();