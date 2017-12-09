class Utils {

	public static timeSince(timestamp : number, seconds = true) {
		let output = (+ new Date()) - timestamp;
		return seconds ? Math.floor(output / 1000) : output;
	}

}

export default Utils;