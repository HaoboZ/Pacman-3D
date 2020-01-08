import Main from '../../main';
import Entity from '../index';
import Ghost from './index';


export default class Clyde extends Ghost {
	
	constructor( scene: Main, x, y, props ) {
		super( scene, x, y, 'clyde', props );
	}
	
	createEvents( x, y ) {
		super.createEvents( x, y );
		this.scene.events.on( 'pacmanEatPellet', total => {
			if ( this.getData( 'home' ) && total <= 244 - 60 ) {
				this.setData( 'home', false );
			}
		} );
	}
	
	//////////////////////////////////////////////////
	
	updateTarget() {
		const pacman = this.scene.data.get( 'pacman' ) as Entity;
		const pacmanPos = this.scene.map.worldToTileXY( pacman.x, pacman.y ),
		      tilePos   = this.scene.map.worldToTileXY( pacman.x, pacman.y );
		if ( Phaser.Math.Distance.Squared( tilePos.x, tilePos.y, pacmanPos.x, pacmanPos.y ) > 64 ) {
			this.target.setFromObject( pacmanPos );
		} else {
			this.target.setFromObject( this.home );
		}
	}
	
}
