
$(document).ready(function()
{
	$(".btn-save").click(function()
	{
		const block = $(this).attr("data-block");
		console.log(block,$("#block-${block}-notes").val());
		pv.saveNote(block,$("#block-${block}-notes").val());
		Materialize.toast("Saved",5000);
	});
	if(pv.getOption("autosave") === true)
	{
		function noteSave(){
			var block = $(this).attr("data-block");
			console.log(block,$(this).val());
			pv.saveNote(block,$(this).val());
			Materialize.toast("Saved",5000);
		}
		$(".materialize-textarea").change(noteSave);
		$(".materialize-textarea").focusout(noteSave);
	}
	if(localStorage.getItem("notes") == null) pv.resetNotes(); //Ensures that the notes start out ready.
	pv.updateNotes();
})
