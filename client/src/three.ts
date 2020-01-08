import * as THREE from 'three';

import Controls from './controls';


export default class Scene extends THREE.Scene {
	
	// Basic perspective camera
	camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight );
	// WebGL renderer with anti-aliasing
	renderer = new THREE.WebGLRenderer( { antialias: true } );
	
	controls: Controls;
	
	updateList = [];
	
	constructor() {
		super();
		
		this.renderer.setClearColor( '#000000' );
		this.renderer.setSize( window.innerWidth, window.innerHeight );
		document.body.appendChild( this.renderer.domElement );
		
		window.addEventListener( 'resize', () => {
			this.renderer.setSize( window.innerWidth, window.innerHeight );
			this.camera.aspect = window.innerWidth / window.innerHeight;
			this.camera.updateProjectionMatrix();
		} );
		
		this.create();
	}
	
	create() {
		this.controls = new Controls( this.camera, this.renderer.domElement );
		this.addUpdate( this.controls );
		
		this.camera.position.set( 112, 64, 300 );
		this.camera.rotation.set( -.75, 0, 0 );
		
		this.add( new THREE.AmbientLight( '#ffffff' ) );
		
		const geometry = new THREE.PlaneGeometry( 28 * 8, 36 * 8 ),
		      material = new THREE.MeshBasicMaterial( { color: '#202020' } );
		const plane = new THREE.Mesh( geometry, material );
		plane.position.set( 28 * 4, 0, 36 * 4 );
		plane.rotateX( -Math.PI / 2 );
		this.add( plane );
		
		const light = new THREE.PointLight( '#ffffff', 1, 1000 );
		light.position.set( 28 * 4, 100, 36 * 4 );
		this.add( light );
	}
	
	createWall( tile: Phaser.Tilemaps.Tile ) {
		if ( tile.properties.topLeft ) {
			this.createBrick( tile.x * 8 + 2, tile.y * 8 + 2 );
		}
		if ( tile.properties.topRight ) {
			this.createBrick( tile.x * 8 + 6, tile.y * 8 + 2 );
		}
		if ( tile.properties.bottomLeft ) {
			this.createBrick( tile.x * 8 + 2, tile.y * 8 + 6 );
		}
		if ( tile.properties.bottomRight ) {
			this.createBrick( tile.x * 8 + 6, tile.y * 8 + 6 );
		}
	}
	
	wallGeometry = new THREE.BoxGeometry( 4, 8, 4 );
	wallMaterial = new THREE.MeshLambertMaterial( { color: '#000060' } );
	
	createBrick( x, y ) {
		const wall = new THREE.Mesh( this.wallGeometry, this.wallMaterial );
		wall.position.set( x, 4, y );
		this.add( wall );
	}
	
	update() {
		this.updateList.forEach( item => item.update() );
		this.renderer.render( this, this.camera );
	}
	
	addUpdate( item ) {
		if ( !item.update ) return;
		const index = this.updateList.indexOf( item );
		if ( index === -1 ) {
			this.updateList.push( item );
		}
	}
	
	removeUpdate( item ) {
		const index = this.updateList.indexOf( item );
		if ( index > -1 ) {
			this.updateList.splice( index, 1 );
		}
	}
	
}
