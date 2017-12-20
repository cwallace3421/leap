class Helper {

	public static concatAndClear(array1 : any[], array2 : any[]) {
		array1.concat(array2);
		array2.length = 0;
	}

	public static randomIntFromInterval(min : number, max : number) {
		return Math.floor(Math.random() * (max - min + 1) + min);
	}

}

export default Helper;