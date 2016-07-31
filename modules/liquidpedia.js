const request = require( 'request' );

class LiquidPedia {
    constructor(){
        this.baseUrl = 'http://wiki.teamliquid.net/counterstrike/';
    }

    exists( searchPhrase, callback ){
        let _this = this;
        let formattedName = searchPhrase.replace( /\s/g, '_' );
        let options = {
            url: _this.baseUrl + encodeURIComponent( formattedName )
        };

        options.followRedirect = function( response ) {
            formattedName = response.headers.location.replace( _this.baseUrl, '' );
            return true;
        };

        request( options, function( error, response, teams ) {
            let exists = true;

            if( response.statusCode > 200 ){
                exists = false;
            }

            callback.call( _this, {
                name: formattedName,
                exists: exists
            });

            return true;
        });
    }
}

module.exports = new LiquidPedia();
