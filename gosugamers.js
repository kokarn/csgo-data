'use strict';

var cheerio = require( 'cheerio' ),
    request = require( 'request' );

module.exports = {
    baseUrl : 'http://www.gosugamers.net/counterstrike/rankings?tunranked=0&tunranked=1&tname=',
    search : function( searchPhrase, callback ){
        'use strict';
        var _this = this;

        request( _this.baseUrl + searchPhrase, function( error, response, html ){
            var $ = cheerio.load( html ),
                $teams,
                teamList = [];

            if( error ){
                console.log( error );
            }

            $teams = $( '.ranking-link' );

            $teams.each( function( index, element ){
                teamList[ index ] = {
                    name : $teams.eq( index ).find( 'h4' ).text().trim(),
                    id : $( '.ranking-link' ).eq( index ).data( 'id' ),
                };
            });

            callback.call( this, teamList );
        });
    }
};
