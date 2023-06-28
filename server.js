//Require the 'express' library
//Basically have access to the imported library
const express = require('express');
const session = require('express-session');

//This creates an instance of the 'express' server
const app = express();

//Middleware to access the data from forms
app.use(express.json());
app.use(express.urlencoded({extended: true}));

//Middleware to handle session
//'secret' should be provided through environment variables during production
app.use(session({
	secret: 'iasbxkshbhab',
	saveUninitialized: true,
	resave: false,

	//expires is set to false so that users won't be kicked out during the middle of the session
	//But session will be over once they log out or exit the browser
	cookie: {
		expires: false
	}
}))

//Node treats every external file as a module
var routes = require('./app/routes.js');

//Uses the 'pug' library to use html templates, must set 'views' and 'view engine'
//Must download 'pug' library first
//npm install pug
app.set('views', './app/views');
app.set('view engine', 'pug');

//Get the filepath to the data
db_conn = __dirname + "/app/data/database.json"

//Creating a scheme/json object for the database
//Will be storing the user's name, passwords, and uploaded links
db_schema = {
	users: [],
	links: []
}

//Initialize the database using the module
//Making it global allows it to be useable by all modules
global.db = require('./app/fsdb.js')(db_conn, db_schema);

//Using the routes from the external file
app.use('', routes);

//Using javascript from the external file
app.use('/js', express.static('./app/resources/javascript'));

//Using the css from the external file
app.use('/css', express.static('./app/resources/css'));

//Starts a server -- Do 'node server.js' to run
//First parameter is the port number
app.listen(3000, function() {
	console.log('Example app listening on port 3000');
});