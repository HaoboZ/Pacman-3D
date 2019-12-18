import * as cookieParser from 'cookie-parser';
import * as debug from 'debug';
import { config } from 'dotenv';
import * as express from 'express';
import * as logger from 'morgan';
import { AddressInfo } from 'net';
import * as path from 'path';
import * as webpack from 'webpack';
import * as webpack_dev_middleware from 'webpack-dev-middleware';

import webpackConfig from '../webpack.config';
import errorHandler from './errorHandler';


declare const __basedir;

config();

const app = express();

if ( process.env.NODE_ENV === 'development' )
	app.use( logger( 'dev' ) );
app.use( express.json() );
app.use( express.urlencoded( { extended: false } ) );
app.use( cookieParser() );

if ( process.env.NODE_ENV === 'development' ) {
	const compiler = webpack( webpackConfig as any );
	app.use( webpack_dev_middleware( compiler, {
		publicPath: webpackConfig.output.publicPath
	} ) );
}

app.use( express.static( path.join( __basedir, 'public' ) ) );
app.use( '/assets', express.static( path.join( __basedir, 'assets' ) ) );
app.use( '/node_modules', express.static( path.join( __basedir, 'node_modules' ) ) );

app.get( '*', ( req, res ) => {
	const index = path.join( __basedir, 'public', 'index.html' );
	res.sendFile( index );
} );

errorHandler( app );

const debugLog = debug( 'server:server' );

/**
 * Get port from environment and store in Express.
 */
const listener = app.listen( process.env.PORT || 80, () => {
	const address = listener.address() as AddressInfo;
	if ( process.env.NODE_ENV === 'development' )
		debugLog( `Listening on ${address.address}:${address.port}` );
} );
