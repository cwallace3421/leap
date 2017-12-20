class Countdown {

	private timestamp : number;
	private countdown : number;
	private running : boolean;
	private complete : boolean;
	private callback : Function;

	/**
	 * Starts a countdown
	 * @param {number} time - Countdown length
	 * @param {function} callback - Countdown complete callback
	 */
	constructor(time : number, callback : Function) {
		this.timestamp = this.getUnix();
		this.countdown = time;
		this.running = true;
		this.callback = callback;
	}

	/**
	 * Get time left in countdown. Returns 0 is countdown is not running
	 * @public
	 * @returns {number} Time left (miliseconds)
	 */
	public get() {
		return Math.max((this.timestamp + this.countdown) - this.getUnix(), 0);
	}

	/**
	 * Update countdown
	 * @public
	 */
	public update() {
		if (this.running) {
			if (Math.max((this.timestamp + this.countdown) - this.getUnix(), 0) === 0) {
				if (this.callback) {
					this.callback();
				}
				this.running = false;
				this.complete = true;
			}
		}
	}

	/**
	 * Reset countdown
	 * @public
	 */
	public reset() {
		this.timestamp = 0;
		this.countdown = 0;
		this.running = false;
	}

	/**
	 * Trigger the complete callback
	 * @public
	 */
	public triggerCallback() {
		this.callback();
	}

	/**
	 * Is the countdown ready to start
	 * @public
	 * @returns {boolean} Ready
	 */
	public isReady() {
		return !this.running && !this.complete;
	}

	/**
	 * Is the countdown running
	 * @public
	 * @returns {boolean} Running
	 */
	public isRunning() {
		return this.running;
	}

	/**
	 * Get current unix time
	 * @private
	 * @returns {number} Unix time
	 */
	private getUnix() {
		return Math.floor((+new Date()) / 1000);
	}

}

export default Countdown;