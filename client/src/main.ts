import * as THREE from 'three';

import Controls from './controls';


export default class Main extends THREE.Scene {
	
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
		
		this.renderer.setAnimationLoop( () => {
			this.update();
			this.updateList.forEach( item => item.update() );
			this.renderer.render( this, this.camera );
		} );
	}
	
	create() {
		this.controls = new Controls( this.camera, this.renderer.domElement );
		this.addUpdate( this.controls );
		
		this.camera.position.set( 0, 0, 10 );
		
		this.add( new THREE.AxesHelper( 1 ) );
		this.add( new THREE.AmbientLight( '#ffffff' ) );
		
		const loader = new THREE.FontLoader();
		loader.load( 'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/fonts/helvetiker_regular.typeface.json', ( font ) => {
			const textGeometry = new THREE.TextGeometry( 'Hello World!', {
				      font,
				      size:   1,
				      height: .2
			      } ),
			      textMaterial = new THREE.MeshBasicMaterial( { color: '#00ff00' } );
			
			const mesh = new THREE.Mesh( textGeometry, textMaterial );
			mesh.position.set( -4, -.5, 0 );
			
			const wireGeometry = new THREE.EdgesGeometry( mesh.geometry ),
			      wireMaterial = new THREE.LineBasicMaterial( { color: '#000000', linewidth: 1 } );
			
			const wireframe = new THREE.LineSegments( wireGeometry, wireMaterial );
			wireframe.position.copy( mesh.position );
			
			this.add( mesh, wireframe );
		} );
	}
	
	update() {
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
