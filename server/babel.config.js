module.exports = api => {
	api.cache( true );
	
	return {
		'presets': [
			'@babel/preset-env',
			'@babel/preset-typescript'
		],
		'plugins': [
			[
				'@babel/plugin-proposal-decorators',
				{
					'legacy': true
				}
			],
			'transform-class-properties'
		]
	};
};
