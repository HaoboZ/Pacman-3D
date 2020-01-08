import Main from '../main';
import { oppositeDirection } from '../utils';


export default class Entity extends Phaser.GameObjects.Rectangle {
	
	scene: Main;
	body: Phaser.Physics.Arcade.Body;
	
	nextDirection = Phaser.NONE;
	direction = Phaser.NONE;
	
	target = new Phaser.Math.Vector2();
	
	//////////////////////////////////////////////////
	
	constructor( scene: Main, x, y, name: string ) {
		super( scene, x + 4, y + 4, 8, 8, 0xffffff );
		this.name = name;
		
		this.createEvents( x, y );
	}
	
	createEvents( x, y ) {
		this.scene.events.on( 'reset', () => {
			this.setPosition( x + 4, y + 4 );
			this.direction = this.nextDirection = Phaser.NONE;
		} );
		this.scene.events.on( 'end', () => this.body.velocity.set( 0 ) );
	}
	
	//////////////////////////////////////////////////
	
	update() {
		this.updateDirection();
		this.updateVelocity();
		this.updateSnap();
	}
	
	updateDirection() {
		if ( this.direction !== this.nextDirection ) {
			const directionTile = this.getOpenDirections( this.scene.map.worldToTileXY( this.x, this.y ) )[ this.nextDirection ];
			if ( !directionTile || directionTile.index === -1 ) {
				switch ( this.nextDirection ) {
				case Phaser.RIGHT:
				case Phaser.LEFT:
					const tileCenterY = Math.floor( this.body.center.y / 8 ) * 8;
					if ( ( tileCenterY - this.body.y ) * ( tileCenterY - this.body.prev.y ) <= 0 ) {
						this.direction = this.nextDirection;
					}
					break;
				case Phaser.UP:
				case Phaser.DOWN:
					const tileCenterX = Math.floor( this.body.center.x / 8 ) * 8;
					if ( ( tileCenterX - this.body.x ) * ( tileCenterX - this.body.prev.x ) <= 0 ) {
						this.direction = this.nextDirection;
					}
					break;
				}
			}
		}
	}
	
	updateSnap() {
		switch ( this.direction ) {
		case Phaser.UP:
		case Phaser.DOWN:
			this.setX( Phaser.Math.Snap.To( this.x, this.scene.map.tileWidth, this.scene.map.tileWidth / 2 ) );
			break;
		case Phaser.LEFT:
		case Phaser.RIGHT:
			this.setY( Phaser.Math.Snap.To( this.y, this.scene.map.tileHeight, this.scene.map.tileHeight / 2 ) );
			break;
		}
	}
	
	updateVelocity() {
		const velocity = new Phaser.Math.Vector2(
			+( this.direction === Phaser.RIGHT ) - +( this.direction === Phaser.LEFT ),
			+( this.direction === Phaser.DOWN ) - +( this.direction === Phaser.UP ) );
		this.body.velocity.setFromObject( velocity ).scale( this.getSpeed() );
	}
	
	//////////////////////////////////////////////////
	
	getSpeed() {
		return 50;
	}
	
	getOpenDirections( tile: Phaser.Math.Vector2 ) {
		return {
			[ Phaser.RIGHT ]: this.scene.map.getTileAt( tile.x + 1, tile.y, true ),
			[ Phaser.LEFT ]:  this.scene.map.getTileAt( tile.x - 1, tile.y, true ),
			[ Phaser.UP ]:    this.scene.map.getTileAt( tile.x, tile.y - 1, true ),
			[ Phaser.DOWN ]:  this.scene.map.getTileAt( tile.x, tile.y + 1, true )
		};
	}
	
	randomNextDirection( tile: Phaser.Math.Vector2 ) {
		const openDirections = this.getOpenDirections( tile ),
		      directions     = [];
		for ( const direction in openDirections ) {
			if ( !openDirections[ direction ] ) continue;
			if ( openDirections[ direction ].index !== -1 ) continue;
			if ( +direction === oppositeDirection( this.nextDirection ) ) continue;
			directions.push( +direction );
		}
		
		if ( directions.length ) {
			this.nextDirection = Phaser.Utils.Array.GetRandom( directions );
		}
	}
	
	targetNextDirection( tile: Phaser.Math.Vector2 ) {
		const openDirections = this.getOpenDirections( tile );
		let nearestDirection = this.nextDirection,
		    nearestDistance  = Infinity;
		for ( const direction in openDirections ) {
			if ( !openDirections[ direction ] ) continue;
			if ( openDirections[ direction ].index !== -1 ) continue;
			if ( +direction === oppositeDirection( this.nextDirection ) ) continue;
			
			let distance = Phaser.Math.Distance.Squared(
				openDirections[ direction ].x,
				openDirections[ direction ].y,
				this.target.x,
				this.target.y );
			if ( distance < nearestDistance ) {
				nearestDirection = +direction;
				nearestDistance = distance;
			}
		}
		this.nextDirection = nearestDirection;
	}
	
}
