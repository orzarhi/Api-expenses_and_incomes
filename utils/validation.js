exports.checkEmail = (email) => {
	const re =
		/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

	return re.test(email);
};

exports.addSlashes = (text) => {
	return text.replace(/'/g, "\\'");
};

exports.iDValidator = (id) => {
	if (id.length !== 9 || isNaN(id)) {
		return false;
	}
	let sum = 0,
		incNum;
	for (let i = 0; i < id.length; i++) {
		incNum = Number(id[i]) * ((i % 2) + 1);
		sum += incNum > 9 ? incNum - 9 : incNum;
	}
	return sum % 10 === 0;
};

exports.isEmpty = (value) => {
	if (!value) return false;
	return true;
};

exports.checkPassword = (password) => {
	if (password.length <= 6) return false;
	return true;
};

exports.checkUsername = (username) => {
	if (username.length <= 1) return false;
	return true;
};
