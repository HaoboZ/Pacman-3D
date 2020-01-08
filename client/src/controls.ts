import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls';


export default class Controls extends PointerLockControls {
	
	moveDirection = {
		forward:  false,
		backward: false,
		left:     false,
		right:    false,
		up:       false,
		down:     false
	};
	
	speed = 1;
	
	constructor( camera: THREE.Camera, domElement?: HTMLElement ) {
		super( camera, domElement );
		
		this.lock();
		window.onclick = () => {
			if ( !this.isLocked ) {
				this.lock();
			}
		};
		
		window.addEventListener( 'keydown', this.onKeyDown, false );
		window.addEventListener( 'keyup', this.onKeyUp, false );
	}
	
	onKeyDown = ( event: KeyboardEvent ) => {
		switch ( event.key ) {
		case 'ArrowUp':
		case 'w':
		case 'W':
			this.moveDirection.forward = true;
			break;
		case 'ArrowLeft':
		case 'a':
		case 'A':
			this.moveDirection.left = true;
			break;
		case 'ArrowDown':
		case 's':
		case 'S':
			this.moveDirection.backward = true;
			break;
		case 'ArrowRight':
		case 'd':
		case 'D':
			this.moveDirection.right = true;
			break;
		case 'r':
		case 'R':
			this.moveDirection.up = true;
			break;
		case 'f':
		case 'F':
			this.moveDirection.down = true;
			break;
		}
	};
	onKeyUp = ( event: KeyboardEvent ) => {
		switch ( event.key ) {
		case 'ArrowUp':
		case 'w':
		case 'W':
			this.moveDirection.forward = false;
			break;
		case 'ArrowLeft':
		case 'a':
		case 'A':
			this.moveDirection.left = false;
			break;
		case 'ArrowDown':
		case 's':
		case 'S':
			this.moveDirection.backward = false;
			break;
		case 'ArrowRight':
		case 'd':
		case 'D':
			this.moveDirection.right = false;
			break;
		case 'r':
		case 'R':
			this.moveDirection.up = false;
			break;
		case 'f':
		case 'F':
			this.moveDirection.down = false;
			break;
		}
	};
	
	update() {
		this.moveForward( ( +this.moveDirection.forward - +this.moveDirection.backward ) * this.speed );
		this.moveRight( ( +this.moveDirection.right - +this.moveDirection.left ) * this.speed );
		this.getObject().position.y += ( +this.moveDirection.up - +this.moveDirection.down ) * this.speed;
	}
	
}
