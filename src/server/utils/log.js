const Log = {
	info: function(message) {
		console.info(message);
	},

	error: function(message) {
		console.error(message);
	},

	debug: function(message) {
		console.debug(message);
	}
};
module.exports = Log;