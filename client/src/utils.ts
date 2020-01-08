const opposites = {
	[ Phaser.UP ]:    Phaser.DOWN,
	[ Phaser.DOWN ]:  Phaser.UP,
	[ Phaser.LEFT ]:  Phaser.RIGHT,
	[ Phaser.RIGHT ]: Phaser.LEFT
};

export function oppositeDirection( direction ) {
	return opposites[ direction ];
}
