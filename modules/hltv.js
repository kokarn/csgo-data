'use strict';

var request = require( 'request' );

module.exports = {
    baseUrl : 'http://www.hltv.org/?pageid=255&res=5&team=1&term=',
    search : function( searchPhrase, callback ){
        var _this = this,
            rawTeamList = false,
            teamList = [],
            i;

        request( _this.baseUrl + encodeURIComponent( searchPhrase ), function( error, response, teams ) {
            rawTeamList = JSON.parse( teams );

            for( i = 0; i < rawTeamList.length; i = i + 1 ){
                if( rawTeamList[ i ].teamid > 0 ){
                    teamList.push({
                        name : rawTeamList[ i ].name,
                        id : rawTeamList[ i ].teamid,
                        country : rawTeamList[ i ].country
                    });
                }
            }

            callback.call( this, teamList );
        });
    }
};
