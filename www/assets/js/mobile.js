/*
* PlanView Chrome Extension Library
*/

window.pv = window.pv ||
{
	getOption: function(option)
	{
		return localStorage.getItem(option);
	},
	updateOption: function(option,value,callback)
	{
		var current = localStorage.getItem(option);
		if(pv.containsDifference(current,value))
		{
			localStorage.setItem(option,value);
			pv.pushChange("UPDATE","pv.updateOption",current,value,{"format":"STRING","syncUpdated":true});
			return true;
		}
		else return false;
	},
	setOption: function(option,value)
	{
		return pv.updateOption(option,value);
	},
	pushChange: function(type,initiator,previous,current,otherInfo)
	{
		/*TODO:Add code to this. I have no idea how I'm going to implement it but it's supposed to basically serve as an undo*/
		console.log("Change received:",type,initiator,previous,current,otherInfo);
		return;
	},
	containsDifference: function(before, after)
	{
		return !(after === before)
	},
	init: function(otherInit)
	{
		/*Init functions*/
		pv.links.updateLinks();
		$(".button-collapse").sideNav();
		$(".class").off("click");
		$(".class").click(pv.links.events.click);
		if(typeof otherInit === "string" && typeof pv["init_"+otherInit] === "function")
			pv["init_"+otherInit]();
		$("a.smoothscroll").click(function(e)
		{
			e.preventDefault();
			$('html, body').animate({
				scrollTop: $($(this).attr("href")).offset().top - 70
			}, 1000);
		});
	},
	init_settings: function()
	{
		$("#save-links").off("click");
		$("#save-emails").off("click");
		$("#save-links").click(pv.links.events.saveAll);
		$("#save-emails").click(pv.emails.events.saveAll);
		$("#autosave").change(function(){pv.updateOption("autosave",$(this).is(":checked")); Materialize.toast("Autosave settings updated!",1000);});
		for(var i = 1; i <=8; i++)
		{
			$("#block-"+i+"-link").val(pv.links.getBlock(i).replace(/#noLink/g,""));
			$("#block-"+i+"-email").val(pv.emails.getBlock(i).replace(/#noEmail/g,""));
		}
	},
	init_notes: function()
	{
		if(localStorage.getItem("notes") == null)
			pv.notes.create();
		pv.notes.fillAll();
		pv.notes.addListeners(); //See $(".email").click(...) for why I implemented like this!

		if(localStorage.getItem("emails") == null)
			pv.emails.create();
		pv.emails.updateEmails();
		$(".email").click(pv.emails.events.click); //Why did I not create a function like I did for pv.notes.addListeners() to add listeners? Because Email has only one listener while notes have many more (ie focus)

		$("clearNotes").click(pv.notes.create);
	},
	emails:
	{

		getBlock: function(block)
		{
			return JSON.parse(pv.getOption("emails"))[block];
		},
		updateBlock: function(block,email)
		{
			var current = JSON.parse(pv.getOption("emails")), previous = current[block];
			if(pv.containsDifference(previous,email))
			{
				current[block] = email;
				pv.updateOption("emails",JSON.stringify(current));
				pv.pushChange("UPDATE","email.updateBlock",previous,email,{"block":block,"format":"STRING"});
				return true;
			}
			return false;
		},
		setBlock: function(block,email)
		{
			return pv.emails.updateBlock(block,email);
		},
		resetEmails: function()
		{
			var del = JSON.parse(pv.getOption("emails"));
			for(toDel in del)
			{
				pv.emails.updateBlock(toDel,"");
			}
			pv.pushChange("RESET","email.resetEmails",del,JSON.parse(pv.getOption("emails")),{"format":"JSON"});
		},
		workabale: function(check)
		{
			return ((typeof check !== "undefined") && (check !== "") && (check !== null));
		},
		create: function()
		{
			var old = pv.getOption("emails");
			pv.updateOption("emails",'{"1":"#noEmail","2":"#noEmail","3":"#noEmail","4":"#noEmail","5":"#noEmail","6":"#noEmail","7":"#noEmail","8":"#noEmail"}');
			pv.pushChange("REBUILD","email.create",JSON.parse(old),JSON.parse(pv.getOption("emails")),{"format":"JSON"})
		},
		openEmail:function(email)
		{
			window.open("mailto:"+email,"_system");
		},
		updateEmails: function(prefix,suffix)
		{
			prefix = prefix || "#block-";
			suffix = suffix || "-email";
			for(var i = 1 ; i <=8; i++)
			{
				var email = pv.emails.getBlock(i);
				$(prefix+i+suffix).attr("data-email",email);
				email = (email.indexOf("#") >= 0) ? "No email set!" : email;
				$(prefix+i+suffix).attr("title",email);
			}
		},
		events:
		{
			click:function(event)
			{
				var email = $(this).attr("data-email");
				email.replace(/mailto:/g,""); //Ensures that adding mailto won't make it mailto:mailto:example@hexr.org
				if(email.indexOf("#") == 0 || email == "")
				{
					event.preventDefault();
					$("#noEmail").openModal();
				}
				else pv.emails.openEmail(email);
			},
			saveAll: function(event)
			{
				event.preventDefault()
				for(var i = 1; i<=8; i++)
				{
					var email = $("#block-"+i+"-email").val();
					if(email == "" || email == null)
						email = "#noEmail";
					pv.emails.updateBlock(i,email);
				}
				Materialize.toast("Emails updated!",5000)
			}
		}
	},
	links:
	{
		getBlock: function(block)
		{
			return JSON.parse(pv.getOption("links"))[block];
		},
		updateBlock: function(block,link)
		{
			var current = JSON.parse(pv.getOption("links")), previous = current[block];
			if(pv.containsDifference(previous,link))
			{
				current[block] = link;
				if(link == "") link = "#noLink";
				pv.updateOption("links",JSON.stringify(current));
				pv.pushChange("UPDATE","links.updateBlock",previous,link,{"block":block,"format":"STRING"});
				return true;
			}
			return false;
		},
		setBlock: function(block,link)
		{
			return pv.links.updateBlock(block,link);
		},
		resetLinks: function()
		{
			var del = JSON.parse(pv.getOption("links"));
			for(toDel in del)
			{
				pv.links.updateBlock(toDel,"");
			}
			pv.pushChange("RESET","links.resetLinks",del,JSON.parse(pv.getOption("links")),{"format":"JSON"});
		},
		workabale: function(check)
		{
			return ((typeof check !== "undefined") && (check !== "") && (check !== null));
		},
		create: function()
		{
			var old = pv.getOption("links");
			pv.updateOption("links",'{"1":"#noLink","2":"#noLink","3":"#noLink","4":"#noLink","5":"#noLink","6":"#noLink","7":"#noLink","8":"#noLink"}');
			for(var i = 1; i <= 8; i++)
			{
				pv.links.setBlock(i,""); //Even though set is deprecated it's more definitive of what we're doing
			}
			pv.pushChange("REBUILD","links.create",JSON.parse(old),JSON.parse(pv.getOption("links")),{"format":"JSON"})
		},
		updateLinks: function(prefix,suffix)
		{
			prefix = prefix || "#block-";
			suffix = suffix || "";
			for(var i = 1 ; i <=8; i++)
			{
				$(prefix+i+suffix).attr("data-location",pv.links.getBlock(i));
			}
		},
		events:
		{
			saveAll: function(event)
			{
				event.preventDefault()
				for(var i = 1; i<=8; i++)
				{
					var link = $("#block-"+i+"-link").val();
					if(link == "" || link == null)
						link = "#noLink";
					pv.links.updateBlock(i,link);
				}
				Materialize.toast("Links saved!",5000)
			},
			click: function(event)
			{
				event.preventDefault();
				link = $(this).attr("data-location");
				window.alert("link");
				if(link.indexOf("#") == 0 || link == "")
					$("#noLink").openModal();
				else pv.links.open(link)
			}
		},
		open: function(what)
		{
			window.alert("attempting to open",what)
			window.open(what, '_system', 'location=yes');
		},
	},
	notes:
	{
		getBlock: function(block)
		{
			return JSON.parse(pv.getOption("notes"))[block];
		},
		updateBlock: function(block,note)
		{
			var current = JSON.parse(pv.getOption("notes")), previous = current[block];
			if(pv.containsDifference(previous,note))
			{
				current[block] = note;
				pv.updateOption("notes",JSON.stringify(current));
				pv.pushChange("UPDATE","notes.updateBlock",previous,note,{"block":block,"format":"STRING"});
				return true;
			}
			return false;
		},
		setBlock: function(block,note)
		{
			return pv.notes.updateBlock(block,note);
		},
		resetNotes: function()
		{
			var del = JSON.parse(pv.getOption("notes"));
			for(toDel in del)
			{
				pv.notes.updateBlock(toDel,"");
			}
			pv.pushChange("RESET","notes.resetNotes",del,JSON.parse(pv.getOption("notes")),{"format":"JSON"});
		},
		workabale: function(check)
		{
			return ((typeof check !== "undefined") && (check !== "") && (check !== null));
		},
		create: function()
		{
			var old = pv.getOption("notes");
			pv.updateOption("notes",'{"1":"","2":"","3":"","4":"","5":"","6":"","7":"","8":""}');
			pv.pushChange("REBUILD","notes.create",JSON.parse(old),JSON.parse(pv.getOption("notes")),{"format":"JSON"})
		},
		fillAll: function(prefix,suffix)
		{
			prefix = prefix || "#block-";
			suffix = suffix || "-notes";
			for(var i = 1; i <= 8; i++)
			{
				$(prefix+i+suffix).val(pv.notes.getBlock(i));
			}
		},
		addListeners: function()
		{
			$(".btn-save").off("click");
			$(".btn-save").click(pv.notes.events.save);
			if(pv.getOption("autosave") == "true")
			{
				$(".materialize-textarea").off("change");
				$(".materialize-textarea").off("focusout");
				$(".materialize-textarea").change(pv.notes.events.save);
				$(".materialize-textarea").focusout(pv.notes.events.save);
			}
		},
		events:
		{
			save: function()
			{
				var block = $(this).attr("data-block"), old = pv.notes.getBlock(block), nu = $("#block-"+block+"-notes").val(), buttonClicked  = $(this).hasClass("btn-save");
				if(!pv.containsDifference(old,nu))
				{
					if(buttonClicked)
						Materialize.toast("Nothing to do here!",500)
				}
				else
				{
					console.log(pv.notes.updateBlock(block,nu));
					pv.pushChange("UPDATE","pv.notes.events.save",old,nu,{"format":"STRING"});
					Materialize.toast("Block "+block+" updated!",2500);
				}
			},
		}
	},
	firstRun: function()
	{
		pv.links.create();
		pv.emails.create();
		pv.notes.create();
		pv.updateOption("autosave",false);
		pv.updateOption("initialized",true);
	}
};
if(!(pv.getOption("initialized") === "true")) pv.firstRun();