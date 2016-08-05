$(document).ready(function()
{
	$(".btn-save").click(function()
	{
		let block = $(this).attr("data-block");
		console.log(block,$("#block-"+block+"-notes").val());
		pv.saveNote(block,$("#block-"+block+"-notes").val());
		Materialize.toast("Saved",5000);
	});
	if(localStorage.getItem("notes") == null) resetNotes(); //Ensures that the notes start out ready.
	pv.updateNotes();
})