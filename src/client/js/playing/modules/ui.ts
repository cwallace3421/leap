export class ImportantMessage implements UI {

	private elmContainer : JQuery<any>;
	private elmMessage : JQuery<any>;

	constructor(message : any, hidden? : boolean) {
		console.log('creating important message ui');
		this.elmContainer = $('<div>', {
			class: 'ui-container ui-message'
		});
		this.elmMessage = $('<span>');
		this.elmContainer.append(this.elmMessage);
		$('#app').append(this.elmContainer);

		if (hidden) {
			this.hide();
		}
		this.setMessage(message);
		console.log(this.elmContainer);
	}

	public getMessage() {
		return this.elmMessage.html();
	}

	public setMessage(message : any) {
		return this.elmMessage.html(message);
	}

	public isEmpty() {
		return $.trim(this.elmMessage.html()) == '';
	}

	public time(miliseconds : number, callback : Function) {
		window.setTimeout(callback, miliseconds);
	}

	public visible() {
		return this.elmContainer.hasClass('hidden');
	}

	public hide() {
		this.elmContainer.addClass('hidden');
	}

	public show() {
		this.elmContainer.removeClass('hidden');
	}

	public kill() {
		this.elmContainer.remove();
	}
}

interface UI {
	visible : Function;
	hide : Function;
	show : Function;
	kill : Function;
}

// class UI {

// 		private elmContainer : JQuery<any>;
// 		private elmLeft : JQuery<any>;
// 		private elmMiddle : JQuery<any>;
// 		private elmRight : JQuery<any>;
// 		private elmMessage : JQuery<any>;

// 		/**
// 		 * Builds the UI for the Playing State
// 		 * @public
// 		 */
// 		public init() {
// 			let app = $('#app');

// 			// Build Containers
// 			this.elmContainer = $('<div>', {
// 				id: 'ui-playing',
// 				class: 'ui-container'
// 			});

// 			this.elmLeft = $('<div>', {
// 				id: 'ui-left',
// 				class: 'ui-item'
// 			});

// 			this.elmMiddle = $('<div>', {
// 				id: 'ui-middle',
// 				class: 'ui-item message'
// 			});

// 			this.elmRight = $('<div>', {
// 				id: 'ui-right',
// 				class: 'ui-item'
// 			});

// 			// Populate Containers
// 			this.elmMessage = $('<span>');
// 			this.elmMiddle.append(this.elmMessage);

// 			// Append Containers
// 			this.elmContainer.append(this.elmLeft);
// 			this.elmContainer.append(this.elmMiddle);
// 			this.elmContainer.append(this.elmRight);

// 			app.append(this.elmContainer);
// 		}

// 		/**
// 		 * Destorys the UI
// 		 * @public
// 		 */
// 		public destory() {
// 			this.elmContainer.remove();
// 		}

// 		/**
// 		 * Sets and Shows the message
// 		 * @public
// 		 * @param {string} message
// 		 */
// 		public setMessage(value : any) {
// 			this.elmMessage.html(value);
// 			this.showMessage();
// 		}

// 		/**
// 		 * Gets the message
// 		 * @public
// 		 * @returns {string} The current message
// 		 */
// 		public getMessage() {
// 			return this.elmMessage.html();
// 		}

// 		/**
// 		 * Clears the message to an empty string
// 		 * @public
// 		 */
// 		public clearMessage() {
// 			this.elmMessage.html('');
// 		}

// 		/**
// 		 * Clears and Hides the message
// 		 * @public
// 		 */
// 		public hideMessage() {
// 			this.clearMessage();
// 			this.elmMessage.parent().addClass('hidden');
// 		}

// 		/**
// 		 * Hides the message parent
// 		 * @public
// 		 */
// 		public showMessage() {
// 			this.elmMessage.parent().removeClass('hidden');
// 		}

// 		/**
// 		 * Is the message parent hidden?
// 		 * @public
// 		 * @returns {boolean} is message hidden
// 		 */
// 		public isMessageHidden() {
// 			return this.elmMessage.parent().hasClass('hidden');
// 		}
// 	}