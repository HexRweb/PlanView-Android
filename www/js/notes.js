$(document).ready(function()
{
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
})