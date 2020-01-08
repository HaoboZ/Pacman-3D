import Main from '../../main';
import Entity from '../index';
import Ghost from './index';


export default class Blinky extends Ghost {
	
	constructor( scene: Main, x, y, props ) {
		super( scene, x, y, 'blinky', props );
	}
	
	createEvents( x, y ) {
		super.createEvents( x, y );
		this.scene.events.on( 'reset',
			() => this.setData( 'home', false ) );
	}
	
	//////////////////////////////////////////////////
	
	updateTarget() {
		const pacman = this.scene.data.get( 'pacman' ) as Entity;
		this.target.setFromObject( this.scene.map.worldToTileXY( pacman.x, pacman.y ) );
	}
	
}
