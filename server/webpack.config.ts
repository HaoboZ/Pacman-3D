import * as path from 'path';
import * as webpack from 'webpack';


export default {
	entry:        [
		path.join( __dirname, '..', 'client', 'src', 'index.ts' )
	],
	output:       {
		path:       path.join( __dirname, '..', 'client', 'public', 'build' ),
		filename:   '[name].bundle.js',
		publicPath: '/build'
	},
	devtool:      'source-map',
	mode:         'development',
	module:       {
		rules: [
			{
				test:   /\.[tj]s$/,
				loader: [ 'babel-loader' ]
			},
			{
				test:   /\.css$/,
				loader: [ 'style-loader', 'css-loader' ]
			}
		]
	},
	plugins:      [ new webpack.HotModuleReplacementPlugin() ],
	resolve:      {
		extensions: [ '.js', '.ts', '.css' ]
	},
	optimization: {
		splitChunks: {
			chunks: 'all'
		}
	}
};
