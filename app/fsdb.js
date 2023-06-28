//Uses the 'fs' module that must be installed separately
//Gives access to the file system
const fs = require('fs');

var loadData = (db_connection, schema = {}) => {

	//Creates a new database if it does not exist
	if (!fs.existsSync(db_connection)) {
		fs.writeFileSync(db_connection, JSON.stringify(schema));
	}

	//Loads the database form the file system
	var model = require(db_connection);

	//Create the database object
	var db = {
		model: model,
		filename: db_connection,

		//Allows us to make changes to the database
		update: () => {
			fs.writeFileSync(db_connection, JSON.stringify(model));
		},
		addCollection: (collection) => {
			model['collection'] = [];
		}
	}

	return db;
}

//Export the method
module.exports = loadData;