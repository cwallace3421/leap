class Helper {

	static concatAndClear(array1, array2) {
		array1.concat(array2);
		array2.length = 0;
	}

	static randomIntFromInterval(min, max) {
		return Math.floor(Math.random() * (max - min + 1) + min);
	}

}

export default Helper;