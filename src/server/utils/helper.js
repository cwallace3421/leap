const Helper = {

	concatAndClear: function(array1, array2) {
		array1.concat(array2);
		array2.length = 0;
	},

	randomIntFromInterval: function(min, max) {
		return Math.floor(Math.random() * (max - min + 1) + min);
	}

};
module.exports = Helper;