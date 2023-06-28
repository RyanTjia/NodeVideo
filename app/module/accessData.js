module.exports = {
	findUser: (username) => {
		user = db.model.users.filter(q => q.Username.toLowerCase() == username.toLowerCase())[0];
		return user;
	},

	createAccount: (username, display, password) => {
		new_user = {
			Username: username,
			Display: display,
			Password: password
		}
		db.model.users.push(new_user);
		db.update();

		return new_user;
	},

	changeInfo: (username, newDisplay, newPassword) => {
		current_user = db.model.users.filter(q => q.Username.toLowerCase() == username.toLowerCase())[0];

		//Only if the users want to make changes
		if (newDisplay != '') {
			current_user['Display'] = newDisplay;
		}

		if (newPassword != '') {
			current_user['Password'] = newPassword;
		}
		
		db.update();
	},

	modifyVideoLink: (link) => {

		//Modified to get the embedded link
		var id = link.split("/").pop();
		id = id.split("?")[0];
		id = "https://youtube.com/embed/" + id;

		return id;
	},

	uploadVideo: (user, title, link, desc) => {
		new_video = {
			User: user,
			Title: title,
			Link: link,
			Desc: desc
		}
		db.model.links.push(new_video);
		db.update();
	},

	getVideo: (search) => {
		videos = db.model.links.filter(q => q.Title.includes(search));
		return videos;
	}
}