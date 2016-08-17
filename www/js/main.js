/*Make sure the PlanView object is initialized before doing anything*/
window.pv = window.pv || {};
pv.openClass = pv.openClass || function(link){window.open(link, '_system', 'location=yes')};
pv.classClick = pv.classClick || function(e){return pv.openClass($(this).attr("data-location"));};
pv.updateOption = pv.updateOption || function(option,value,callback){localStorage.setItem(option,value); console.log("Dun diz",localStorage.getItem(option));/* Code to update global preferences*/ callback();};
pv.getOption = pv.getOption || function(option){return localStorage.getItem(option);};
pv.updateLinks = pv.updateLinks || function(){let prefix="#block-";for(let i=1; i<=8;i++){$(prefix+i).attr("data-location",pv.getOption((prefix+i).replace(/#/g,"")));}};
pv.resetNotes = pv.resetNotes || function(){pv.updateOption("notes",JSON.stringify({1:"",2:"",3:"",4:"",5:"",6:"",7:"",8:""}),function(){})};
pv.updateNotes = pv.updateNotes || function(){let name="block-{{ID}}-notes";for(let i=1; i<=8;i++){($("#"+name.replace(/{{ID}}/g,i)).val(pv.getNote(i)))}};
pv.getNote = pv.getNote || function(note){let json = JSON.parse(pv.getOption("notes")); return (json[note]) ? json[note] : ""};
pv.saveNote = pv.saveNote || function(which,what){let json = JSON.parse(pv.getOption("notes")); json[which] = what; pv.updateOption("notes",JSON.stringify(json),function(){})};
$(".class").click(pv.classClick);
$('.button-collapse').sideNav();
pv.updateLinks();


/*Index Functions*/

$(".btn-save").click(function()
{
	let block = $(this).attr("data-block");
	console.log(block,$("#block-"+block+"-notes").val());
	pv.saveNote(block,$("#block-"+block+"-notes").val());
	Materialize.toast("Saved",5000);
});
if(pv.getOption("autosave") == true)
	$(".materialize-textarea").change(function(){
		let block = $(this).attr("data-block");
		console.log(block,$(this).val());
		pv.saveNote(block,$(this).val());
		Materialize.toast("Saved",5000);
	});
	$(".materialize-textarea").focusout(function(){
		let block = $(this).attr("data-block");
		console.log(block,$(this).val());
		pv.saveNote(block,$(this).val());
		Materialize.toast("Saved",5000);
	});
if(localStorage.getItem("notes") == null) pv.resetNotes(); //Ensures that the notes start out ready.
pv.updateNotes();

/*Settings Functions*/

$("#demo").click(function(e){
	e.preventDefault();
	let prefix="#block-",el=prefix + "{{ID}}-link", newLinks = [];
	for(let i = 1; i <= 8 ; i++)
	{
		let valid = $(el.replace(/{{ID}}/g,i))[0].checkValidity() && $(el.replace(/{{ID}}/g,i)).val() != "";
		if(valid)
			newLinks.push($(el.replace(/{{ID}}/g,i)).val());
		else
		{
			$(el.replace(/{{ID}}/g,i)).addClass("invalid");
			Materialize.toast("There was an error",5000);
			return false;
		}

	}
	for(let i =0 ; i <= 7 ; i++)
	{
		let j=i+1
		pv.updateOption((prefix+j).replace(/#/g,""),newLinks[i],function(){$(prefix+j).attr("data-location",newLinks[i])});
	}
	pv.updateOption("autosave",$("#autosave").is(":checked"),function(){});
	Materialize.toast("Settings saved!",5000);
});

function updateInputs()
{
	let prefix="#block-";for(let i=1; i<=8;i++){$(prefix+i+"-link").val(pv.getOption((prefix+i).replace(/#/g,"")));}
}

/*document.ready functions*/
$('.modal-trigger').leanModal();
$('.button-collapse').sideNav();
updateInputs()
$("#loading").hide();