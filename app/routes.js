// Uses the 'express' module and get
// the instance of the Router() object
const express = require('express');
const router = express.Router();

//Looks like the period is to say "current directory"
const accessData = require('./module/accessData.js');

//Register some routes to the router object
router.get('/accountAccess', function (req, res) {
	const tempModel = {
		form: '#login'
	};
	res.render('accountAccess', tempModel);
});

router.post('/accountAccess', function (req, res) {
	const {user, name, pass} = req.body;

	//Try to find if the user exist first
	const userModel = accessData.findUser(user);

	//The variable 'name' determines if user is logging in or signing up as it can
	//only be defined during the sign-up process
	if (name != undefined) {

		//User can create a new account, if that account did not exist
		if (userModel == undefined) {
			const model = accessData.createAccount(user, name, pass);
			req.session.userID = user;
			req.session.isAuthenticated = true;
			res.redirect('/dashboard');
		}

		//Otherwise the user have to retry again
		else {
			const tempModel = {
				form: '#signUp',
				warning: 'Account with this username already exist'
			};
			res.render('accountAccess', tempModel);
		}
	}
	else {

		//User can log in with the correct information
		if (userModel != undefined && userModel.Password == pass) {
			req.session.userID = userModel.Username;
			req.session.isAuthenticated = true;
			res.redirect('/dashboard');
		}

		//Otherwise the user have to retry again
		else {
			const tempModel = {
				form: '#login',
				warning: 'Username or password is incorrect'
			};
			res.render('accountAccess', tempModel);
		}
	}
});

router.get('/dashboard', function (req, res) {

	//If user is not authenticated, then they are forced to login
	if (!req.session.isAuthenticated) {
		res.redirect('/accountAccess');
	}

	else {
		const userModel = accessData.findUser(req.session.userID);
		const tempModel = {
			User: userModel['Username'],
			Display: userModel['Display'],
			Video: accessData.getVideo('')
		};
		res.render('dashboard', tempModel);
	}
});

router.post('/dashboard', function (req, res) {

	//If user is not authenticated, then they are forced to login
	if (!req.session.isAuthenticated) {
		res.redirect('/accountAccess');
	}

	else {
		const {search} = req.body;
		const userModel = accessData.findUser(req.session.userID);
		const tempModel = {
			User: userModel['Username'],
			Display: userModel['Display'],
			Video: accessData.getVideo(search)
		};
		res.render('dashboard', tempModel);
	}
});

router.get('/logout', function (req, res) {
	req.session.destroy((err) => {
		if (err) {
			console.log(err);
			res.send(err);
		}
		else {
			res.redirect('/accountAccess');
		}
	})
});

router.get('/profile', function (req, res) {

	//If user is not authenticated, then they are forced to login
	if (!req.session.isAuthenticated) {
		res.redirect('/accountAccess');
	}

	else {
		const userModel = accessData.findUser(req.session.userID);
		const tempModel = {
			User: userModel['Username'],
			Display: userModel['Display'],
			form: '#viewProfile'
		};

		res.render('profile', tempModel);
	}
});

router.post('/profile', function (req, res) {
	const {name, oldPass, newPass} = req.body;
	const userModel = accessData.findUser(req.session.userID);

	//User is redirected to the profile page (view version) and the changes have been saved
	if (userModel.Password == oldPass) {
		accessData.changeInfo(req.session.userID, name, newPass);
		res.redirect('/profile');
	}

	//User is shown the form again, because they gave the incorrect password
	else {
		const tempModel = {
			User: userModel['Username'],
			Display: userModel['Display'],
			form: '#updateProfile',
			warning: 'Incorrect password, changes were not saved'
		};

		res.render('profile', tempModel);
	}
});

router.get('/myVideo', function (req, res) {

	//If user is not authenticated, then they are forced to login
	if (!req.session.isAuthenticated) {
		res.redirect('/accountAccess');
	}

	else {
		var userModel = accessData.findUser(req.session.userID);
		const tempModel = {
			User: userModel['Username'],
			Display: userModel['Display'],
			videos: db.model.links.filter(q => q.User == req.session.userID)
		};
		res.render('myVideo', tempModel);
	}
});

router.get('/upload', function (req, res) {

	//If user is not authenticated, then they are forced to login
	if (!req.session.isAuthenticated) {
		res.redirect('/accountAccess');
	}

	else {
		const userModel = accessData.findUser(req.session.userID);

		//In this page, there is a preview feature to let the user know if that video is available
		//Need more work on that, such as giving tips on how to share the video
		res.render('upload', userModel);
	}
});

router.post('/upload', function (req, res) {
	const {title, link, desc} = req.body;
	Link = accessData.modifyVideoLink(link);
	accessData.uploadVideo(req.session.userID, title, Link, desc);

	//There are three different kinds of youtube video links
	//The link provided by Youtube's share feature works
	//But not the link provided by the url
	res.redirect('/myVideo');
});

// Exports the router object
module.exports = router;