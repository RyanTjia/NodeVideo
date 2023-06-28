//This will be executed whenever the user released the key when inputting
//a value in the field for the link
//https://youtu.be/xTY0SlyVfCQ
function showVid() {
	var formLink = document.querySelector('#Link')
	var vidLink = formLink.value;

	//Modified to get the embedded link
	var id = vidLink.split("/").pop();
	id = id.split("?")[0];
	id = "https://youtube.com/embed/" + id;
	var link = {Link: id}

	//Using handlebars to update the page
	var source = document.querySelector('#previewVid').innerHTML;
	var template = Handlebars.compile(source);
	var html = template(link);

	document.querySelector('#view_template').innerHTML = html;
}

var videoHelp = function() {
	console.log("Copy the link provided by Youtube share feature");
}