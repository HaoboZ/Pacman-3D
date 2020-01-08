import Phaser from 'phaser';

import Main from './main';


function start() {
	new Phaser.Game( {
		type:    Phaser.AUTO,
		physics: {
			default: 'arcade',
			arcade:  {
				debug:    true,
				tileBias: 4
			}
		},
		render:  { pixelArt: true },
		scale:   {
			mode:       Phaser.Scale.FIT,
			parent:     'root',
			autoCenter: Phaser.Scale.CENTER_BOTH,
			width:      28 * 8,
			height:     36 * 8
		},
		scene:   Main
	} );
}

document.addEventListener( 'DOMContentLoaded', start );
