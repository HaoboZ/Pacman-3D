import Main from '../../main';
import Entity from '../index';
import Ghost from './index';


export default class Inky extends Ghost {
	
	constructor( scene: Main, x, y, props ) {
		super( scene, x, y, 'inky', props );
	}
	
	createEvents( x, y ) {
		super.createEvents( x, y );
		this.scene.events.on( 'pacmanEatPellet', total => {
			if ( this.getData( 'home' ) && total <= 244 - 30 ) {
				this.setData( 'home', false );
			}
		} );
	}
	
	//////////////////////////////////////////////////
	
	updateTarget() {
		const pacman = this.scene.data.get( 'pacman' ) as Entity,
		      blinky = this.scene.data.get( 'blinky' ) as Entity;
		
		const velocity = new Phaser.Math.Vector2(
			+( pacman.direction === Phaser.RIGHT ) - +( pacman.direction === Phaser.LEFT ),
			+( pacman.direction === Phaser.DOWN ) - +( pacman.direction === Phaser.UP ) );
		
		this.target.setFromObject( this.scene.map.worldToTileXY( pacman.x, pacman.y )
			.add( velocity.scale( 2 ) ).scale( 2 )
			.subtract( this.scene.map.worldToTileXY( blinky.x, blinky.y ) ) );
	}
	
}
