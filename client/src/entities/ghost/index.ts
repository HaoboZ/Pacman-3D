import Main from '../../main';
import { oppositeDirection } from '../../utils';
import Entity from '../index';


export default class Ghost extends Entity {
	
	home: Phaser.Math.Vector2;
	
	prevTile: Phaser.Math.Vector2;
	
	//////////////////////////////////////////////////
	
	constructor( scene: Main, x, y, name: string, props ) {
		super( scene, x, y, name );
		this.home = new Phaser.Math.Vector2( props.homeX, props.homeY );
		this.setDataEnabled();
	}
	
	createEvents( x, y ) {
		super.createEvents( x, y );
		this.scene.events.on( 'reset', () => {
			this.setData( 'home', true );
			this.setData( 'mode', true );
			this.setData( 'fright', 0 );
			this.setData( 'dead', false );
			this.prevTile = null;
			this.setActive( true );
		} );
		this.scene.events.on( 'ghostModeChange', home => {
			this.reverse();
			this.setData( 'mode', home );
		} );
		this.scene.events.on( 'pacmanEatPellet', ( total, power ) => {
			// TODO: unremove power pellet
			// if ( power && !this.getData( 'dead' ) ) {
			// 	this.reverse();
			// 	this.setData( 'fright', 2 );
			// 	this.scene.time.delayedCall( 4500, () => {
			// 		if ( this.getData( 'fright' ) === 2 ) {
			// 			this.setData( 'fright', 1 );
			// 		}
			// 	} );
			// 	this.scene.time.delayedCall( 6000, () => {
			// 		this.setData( 'fright', 0 );
			// 	} );
			// }
		} );
		this.scene.events.on( 'ghostLeave', res => {
			if ( this.getData( 'home' ) && !res.left ) {
				this.setData( 'home', false );
				res.left = true;
			}
		} );
		this.scene.events.on( 'end', () => {
			this.setActive( false );
		} );
		this.on( 'changedata-home', ( _, val ) => {
			if ( !val ) {
				this.setPosition( 112, 116 );
			}
		} );
	}
	
	//////////////////////////////////////////////////
	
	update() {
		const tile = this.scene.map.worldToTileXY( this.x, this.y );
		if ( !this.prevTile || !tile.equals( this.prevTile ) ) {
			if ( this.getData( 'dead' ) ) {
				if ( tile.y === 14
					&& ( tile.x === 13 || tile.x === 14 )
					&& ( this.prevTile.x === 13 || this.prevTile.x === 14 ) ) {
					this.setData( 'dead', false );
				}
			}
			this.updateNextDirection( tile );
			this.prevTile = tile;
		}
		super.update();
	}
	
	updateNextDirection( tile: Phaser.Math.Vector2 ) {
		if ( this.getData( 'dead' ) ) {
			this.target.set( 13, 14 );
		} else if ( this.getData( 'mode' ) ) {
			this.target.setFromObject( this.home );
		} else {
			this.updateTarget();
		}
		
		if ( this.getData( 'dead' ) || !this.getData( 'fright' ) ) {
			this.targetNextDirection( tile );
		} else {
			this.randomNextDirection( tile );
		}
	}
	
	updateTarget() {
		this.target.setFromObject( this.home );
	}
	
	updateVelocity() {
		if ( !this.getData( 'home' ) ) {
			super.updateVelocity();
		} else {
			this.body.velocity.set( 0 );
		}
	}
	
	updateSnap() {
		if ( !this.getData( 'home' ) && !this.getData( 'dead' ) ) {
			super.updateSnap();
		}
	}
	
	//////////////////////////////////////////////////
	
	reverse() {
		this.nextDirection = oppositeDirection( this.direction );
		this.prevTile = null;
	}
	
	getSpeed() {
		return this.getData( 'dead' ) ? super.getSpeed() * 2 : super.getSpeed() * .8;
	}
	
}
