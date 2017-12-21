import Constants from '../../shared/constants';
import Login from './login/login';
import Playing from './playing/playing';
import Session from './global/session';

window.onload = function() {
    Session.Game = new Phaser.Game(window.innerWidth, window.innerHeight, Phaser.AUTO, 'app', null, false, false);
    Session.Game.state.add(Constants.LOGIN_STATE, new Login());
    Session.Game.state.add(Constants.PLAYING_STATE, new Playing());
    Session.Game.state.start(Constants.LOGIN_STATE);
};

window.addEventListener('resize', function() {
    if (Session.Game.state.states[Session.Game.state.current].resize) {
        Session.Game.state.states[Session.Game.state.current].resize();
    }
}.bind(this));