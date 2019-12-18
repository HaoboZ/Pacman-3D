import * as path from 'path';


global[ '__basedir' ] = path.join( __dirname, '../client' );

require( './src/main' );
