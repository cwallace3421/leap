import Constants from '../../../../shared/constants';
import Utils from '../../global/utils';

class UI {

	private elmContainer : JQuery<any>;
	private elmLeft : JQuery<any>;
	private elmLogin : JQuery<any>;
	private elmLoading : JQuery<any>;
	private elmRight : JQuery<any>;

	/**
	 * Builds the UI for the Login State
	 * @public
	 */
	public init() {
		let app = $('#app');

		// Build Containers
		this.elmContainer = $('<div>', {
			id: 'ui-enter',
			class: 'ui-container'
		});

		this.elmLeft = $('<div>', {
			id: 'ui-left',
			class: 'ui-item'
		});

		this.elmLogin = $('<div>', {
			id: 'ui-middle-login',
			class: 'ui-item login'
		});

		this.elmLoading = $('<div>', {
			id: 'ui-middle-loading',
			class: 'ui-item loading hidden'
		});

		this.elmRight = $('<div>', {
			id: 'ui-right',
			class: 'ui-item'
		});

		// Populate Containers
		this.elmLogin.append(
			$('<label>', {
				html: 'LEAP'
			}),
			$('<input>', {
				type: 'text',
				id: 'txt_username',
				placeholder: 'Nickname e.g. John Jeffery'
			}),
			$('<button>', {
				id: 'btn_enter',
				html: 'Enter'
			}),
			$('<div>', {
				class: 'error'
			})
		);

		this.elmLoading.append($('<img>', {
			src: 'assets/imgs/ajax-loader.gif'
		}));

		// Append Containers
		this.elmContainer.append(this.elmLeft);
		this.elmContainer.append(this.elmLogin);
		this.elmContainer.append(this.elmLoading);
		this.elmContainer.append(this.elmRight);
		app.append(this.elmContainer);
	}

	/**
	 * Destorys the UI
	 * @public
	 */
	public destory() {
		this.elmContainer.remove();
	}

	/**
	 * Sets the error message
	 * @public
	 * @param {string} error messsage
	 */
	public setErrorMessage(value : any) {
		this.elmLogin.children('div.error').html(value);
	}

	/**
	 * Clears the error message
	 * @public
	 */
	public clearErrorMessage() {
		this.elmLogin.children('div.error').html('');
	}

	/**
	 * Gets the entered username
	 * @public
	 * @returns {string} username
	 */
	public getUsername() {
		return this.elmLogin.children('#txt_username').val();
	}

	/**
	 * Clears the username text input
	 * @public
	 */
	public clearUsername() {
		this.elmLogin.children('#txt_username').val('');
	}

	/**
	 * Show the login pane. Hide the loading pane
	 * @public
	 */
	public showLogin() {
		this.elmLoading.addClass('hidden');
		this.elmLogin.removeClass('hidden');
	}

	/**
	 * Show the loading pane. Hide the login pane
	 * @public
	 */
	public showLoading() {
		this.elmLogin.children('input').val('');
		this.elmLogin.addClass('hidden');
		this.elmLoading.removeClass('hidden');
	}

	/**
	 * Sets the callback function for the login button
	 * @public
	 * @param {function} callback
	 */
	public buttonClick(callback : Function) {
		this.elmLogin.children('button').off('click').click(<JQuery.EventHandler<HTMLElement>> callback);
	}
}

export default new UI();