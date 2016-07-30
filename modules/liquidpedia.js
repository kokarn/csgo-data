const request = require( 'request' );

class LiquidPedia {
    constructor(){
        this.baseUrl = 'http://wiki.teamliquid.net/counterstrike/';
    }

    exists( searchPhrase, callback ){
        let _this = this;

        let parsedPhrase = searchPhrase.replace( /\s/g, '_' );
        request( _this.baseUrl + encodeURIComponent( parsedPhrase ), function( error, response, teams ) {
            let exists = true;

            if( response.statusCode > 200 ){
                exists = false;
            }

            callback.call( _this, {
                name: parsedPhrase,
                exists: exists
            });

            return true;
        });
    }
}

module.exports = new LiquidPedia();
