import { Express } from 'express';
import * as createError from 'http-errors';


export default function ( app: Express ) {
	// catch 404 and forward to error handler
	app.use( ( req, res, next ) => {
		next( createError( 404 ) );
	} );

// error handler
	app.use( ( err, req, res, next ) => {
		// set locals, only providing error in development
		res.locals.message = err.message;
		res.locals.error = process.env.NODE_ENV === 'development' ? err : {};
		
		// render the error page
		res.status( err.status || 500 );
		res.render( 'error' );
	} );
}
