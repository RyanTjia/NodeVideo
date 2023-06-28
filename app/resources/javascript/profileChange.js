//This is executed from the html script, so that the data from the backend
//will be given to this frontend script
var initializedHTML = function(form, warning) {

	//Had to put window.onload here so that the data will still be passed
	//and that this will work once the correct element appears
	window.onload = (event) => {
		changeForm(form);

		if (warning != '') {
			const model = {
				note : warning
			}

			var source = document.querySelector('#warning').innerHTML;
			var template = Handlebars.compile(source);
			var html = template(model);

			document.querySelector('#view_warning').innerHTML = html;
		}
	}
}

//Using handlebars to change the form
function changeForm(form) {
	var source = document.querySelector(form).innerHTML;
	var template = Handlebars.compile(source);
	var html = template();

	document.querySelector('#view_template').innerHTML = html;
}