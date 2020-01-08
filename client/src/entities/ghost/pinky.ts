import Main from '../../main';
import Entity from '../index';
import Ghost from './index';


export default class Pinky extends Ghost {
	
	constructor( scene: Main, x, y, props ) {
		super( scene, x, y, 'pinky', props );
	}
	
	createEvents( x, y ) {
		super.createEvents( x, y );
		this.scene.events.on( 'reset',
			() => this.scene.time.delayedCall( 500,
				() => this.setData( 'home', false ) ) );
	}
	
	//////////////////////////////////////////////////
	
	updateTarget() {
		const pacman = this.scene.data.get( 'pacman' ) as Entity;
		const velocity = new Phaser.Math.Vector2(
			+( pacman.direction === Phaser.RIGHT ) - +( pacman.direction === Phaser.LEFT ),
			+( pacman.direction === Phaser.DOWN ) - +( pacman.direction === Phaser.UP ) );
		this.target.setFromObject( velocity ).scale( 4 )
			.add( this.scene.map.worldToTileXY( pacman.x, pacman.y ) );
	}
	
}
