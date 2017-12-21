import Constants from '../../../shared/constants';
import Session from '../global/session';
import Utils from '../global/utils';

class Connection {

	/**
	 * Start the socket connection
	 * @public
	 * @param {function} startCallback - Socket connection callback
	 */
	public start(startCallback? : Function) {
		console.log('Attempting To Open Socket To Server');

		Session.Socket = io(undefined, {
			query: 'id=' + Session.Id + '&nick=' + Session.Nick
		});

		if (!Session.Socket) {
			throw 'Unable to open socket connection';
		}

		Session.Socket.on(Constants.EVENTS.WORLD_JOINED, (response : any, ack : Function) => {
			this.socketEventLog(Constants.EVENTS.WORLD_JOINED, response);
			if (startCallback) {
				startCallback(response);
			}
			ack('SUCCESS');
		});
	}

	/**
	 * Register an event for the socket
	 * @public
	 * @param {string} name - The event name
	 * @param {function} callback - Callback for event
	 */
	public registerEvent(name : string, callback? : Function) {
		Session.Socket.on(name, (response : object) => {
			if (callback) {
				callback(response);
			}
			Session[name] = response;
			if (name !== Constants.EVENTS.SERVER_UPDATE) {
				this.socketEventLog(name, response);
			}
		});
	}

	/**
	 * Send data to the server via the socket
	 * @public
	 * @param {string} name - Event name
	 * @param {any} data - Data to send
	 */
	public emitEvent(name : string, data : object) {
		Session.Socket.emit(name, data);
	}

	/**
	 * Logs an event to the console
	 * @private
	 * @param {string} name - Event name
	 * @param {object} response - The response object
	 */
	private socketEventLog(name : string, response : object) {
		if (Constants.CLIENT_DEBUG) {
			console.log(response);
		}
	}

}

export default new Connection();