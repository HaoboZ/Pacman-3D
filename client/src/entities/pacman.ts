import Main from '../main';


export default class Pacman extends Phaser.GameObjects.Rectangle {
	
	scene: Main;
	body: Phaser.Physics.Arcade.Body;
	
	name = 'pacman';
	
	eatSound = this.scene.sound.add( 'eating' );
	deathSound = this.scene.sound.add( 'miss', {
		volume: .5
	} );
	
	prevTile: Phaser.Math.Vector2;
	
	controls: { [ key: string ]: Phaser.Input.Keyboard.Key };
	
	constructor( scene: Main, x, y ) {
		super( scene, x + 4, y + 4, 8, 8, 0xffff00 );
		
		this.rotation = Math.PI / 4;
		
		this.createEvents( x, y );
		
		this.eatSound.addMarker( {
			name:     'play',
			start:    1.20,
			duration: .24,
			config:   {
				volume: .5
			}
		} );
		
		this.controls = this.scene.input.keyboard.addKeys( {
			up:    Phaser.Input.Keyboard.KeyCodes.W,
			down:  Phaser.Input.Keyboard.KeyCodes.S,
			left:  Phaser.Input.Keyboard.KeyCodes.A,
			right: Phaser.Input.Keyboard.KeyCodes.D
		} ) as any;
	}
	
	createEvents( x, y ) {
		this.scene.events.on( 'reset', () => {
			this.setPosition( x + 4, y + 4 );
		} );
		this.scene.events.on( 'end', () => this.body.velocity.set( 0 ) );
		this.scene.events.on( 'pacmanEatPellet', () => {
			if ( !this.scene.data.get( 'dots' ) ) {
				this.scene.events.emit( 'end' );
			}
			if ( !this.eatSound.isPlaying ) {
				this.eatSound.play( 'play' );
			}
		} );
		this.scene.events.on( 'reset', () => this.prevTile = null );
		this.scene.events.on( 'death', () => {
			this.scene.time.delayedCall( 1000, () => this.deathSound.play() );
		} );
	}
	
	//////////////////////////////////////////////////
	
	update( time, delta ) {
		if ( this.scene.data.get( 'end' ) ) return;
		
		const pelletLayer = this.scene.map.getLayer( 'pellets' ).tilemapLayer as Phaser.Tilemaps.DynamicTilemapLayer,
		      tilePos     = this.scene.map.worldToTileXY( this.x, this.y );
		
		if ( !this.prevTile || !tilePos.equals( this.prevTile ) ) {
			const tile = pelletLayer.getTileAt( tilePos.x, tilePos.y );
			if ( tile ) {
				const pellet = tile.index;
				pelletLayer.removeTileAt( tilePos.x, tilePos.y );
				const dots = this.scene.data.get( 'dots' ) - 1;
				this.scene.data.set( 'dots', dots );
				this.scene.events.emit( 'pacmanEatPellet', dots, pellet !== 46 );
			}
			
			this.prevTile = tilePos;
		}
		
		this.rotation += ( +this.controls.right.isDown - +this.controls.left.isDown ) * Math.PI / 512 * delta;
		if ( this.controls.up.isDown )
			this.body.velocity.setToPolar( this.rotation, 60 );
		else
			this.body.velocity.set( 0 );
		// this.oldUpdate();
	}
	
	nextDirection = Phaser.NONE;
	direction = Phaser.NONE;
	
	oldUpdate() {
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
	
}
