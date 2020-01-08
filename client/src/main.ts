import Entity from './entities';
import Pacman from './entities/pacman';


export default class Main extends Phaser.Scene {
	
	// three: Scene;
	
	map: Phaser.Tilemaps.Tilemap;
	
	score: number;
	
	pellets: Phaser.Tilemaps.DynamicTilemapLayer;
	
	entities: Phaser.Physics.Arcade.Group;
	ghosts: Phaser.GameObjects.Group;
	
	ghostTimer: Phaser.Time.TimerEvent;
	
	preload() {
		this.load.image( 'tiles', 'assets/tilemap/maze.png' );
		this.load.tilemapTiledJSON( 'map', 'assets/tilemap/maze.json' );
		this.load.audio( 'eating', 'assets/sounds/eating.mp3' );
		this.load.audio( 'miss', 'assets/sounds/miss.mp3' );
	}
	
	create() {
		// this.three = new Scene();
		
		this.map = this.add.tilemap( 'map' );
		const tiles = this.map.addTilesetImage( 'maze', 'tiles' );
		
		const maze = this.map.createStaticLayer( 'maze', tiles );
		maze.setCollisionByProperty( { collides: true } );
		
		// maze.forEachTile( tile => {
		// 	if ( tile.index !== -1 ) {
		// 		this.three.createWall( tile );
		// 	}
		// } );
		
		this.pellets = this.map.createDynamicLayer( 'pellets', tiles );
		const dotTiles = [];
		this.pellets.forEachTile( ( tile, index ) => dotTiles[ index ] = tile.index );
		this.data.set( 'dotTiles', dotTiles );
		
		this.map.setLayer( maze );
		
		this.entities = this.physics.add.group( { runChildUpdate: true } );
		this.ghosts = this.add.group();
		this.addEntitiesFromLayers();
		
		this.physics.add.collider( this.map.getLayer().tilemapLayer, this.entities );
		this.physics.add.overlap( this.ghosts, this.data.get( 'pacman' ), ( ghost: Entity | any, pacman: Entity | any ) => {
			if ( this.data.get( 'end' ) ) return;
			if ( !this.map.worldToTileXY( ghost.x, ghost.y ).equals( this.map.worldToTileXY( pacman.x, pacman.y ) ) ) return;
			if ( ghost.getData( 'fright' ) ) {
				ghost.setData( 'fright', 0 );
				ghost.setData( 'dead', true );
			} else if ( !ghost.getData( 'dead' ) ) {
				this.events.emit( 'end' );
			}
		} );
		
		this.createEvents();
		
		this.sound.pauseOnBlur = false;
		
		this.events.emit( 'reset' );
	}
	
	addEntitiesFromLayers() {
		this.map.getObjectLayer( 'entities' ).objects.forEach( ( object ) => {
			const SpriteClass = {
				'pacman': Pacman
				// 'blinky': Blinky,
				// 'pinky':  Pinky,
				// 'inky':   Inky,
				// 'clyde':  Clyde
			}[ object.name ];
			if ( SpriteClass ) {
				const sprite: Phaser.Physics.Arcade.Sprite = new SpriteClass( this, object.x, object.y,
					object.properties && object.properties.reduce( ( obj, prop ) => ( {
						...obj,
						[ prop.name ]: prop.value
					} ), {} ) );
				this.entities.add( sprite, true );
				
				this.data.set( object.name, sprite );
				if ( object.type === 'ghost' ) {
					this.ghosts.add( sprite );
				} else {
					sprite.body.setSize( 1, 1 );
				}
			}
		} );
	}
	
	createEvents() {
		this.events.on( 'pacmanEatPellet', () => {
			++this.score;
			this.setGhostTimer();
		} );
		this.events.on( 'reset', () => {
			this.time.removeAllEvents();
			this.pellets.forEachTile( ( tile, index ) => {
				if ( this.data.get( 'dotTiles' )[ index ] ) {
					this.pellets.putTileAt( this.data.get( 'dotTiles' )[ index ], tile.x, tile.y );
				}
			} );
			this.data.set( 'dots', 244 );
			[ 7, 20, 7, 20, 5, 20, 5 ].reduce( ( sum, val, index ) => {
				sum += val;
				this.time.delayedCall( sum * 1000,
					() => this.events.emit( 'ghostModeChange', index % 2 === 1 ) );
				return sum;
			}, 0 );
			this.setGhostTimer();
			
			this.score = 0;
			this.data.set( 'end', false );
		} );
		this.events.on( 'end', () => {
			if ( !this.data.get( 'end' ) ) {
				this.data.set( 'end', true );
				this.events.emit( 'death' );
			}
		} );
		this.events.on( 'death', () => {
			this.time.delayedCall( 3000, () => this.events.emit( 'reset' ) );
		} );
	}
	
	//////////////////////////////////////////////////
	
	update() {
		// this.three.update();
		this.physics.world.wrap( this.entities, -1 );
	}
	
	//////////////////////////////////////////////////
	
	setGhostTimer() {
		if ( this.ghostTimer ) this.ghostTimer.remove();
		this.ghostTimer = this.time.delayedCall( 4500, () => {
			const res = { left: false };
			this.events.emit( 'ghostLeave', res );
			if ( res.left ) {
				this.setGhostTimer();
			}
		} );
	}
	
}
