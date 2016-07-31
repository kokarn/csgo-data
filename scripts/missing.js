const fs = require( 'fs' );

const request = require( 'request' );
const cheerio = require( 'cheerio' );
const jf = require( 'jsonfile' );

const liquidpedia = require( '../modules/liquidpedia' );

class Missing {
    constructor(){
        this.listPage = 'http://wiki.teamliquid.net/counterstrike/Portal:Teams';

        this.liquidTeams = [];
        this.localTeams = [];
    }

    getLiquidTeams(){
        let _this = this;
        let doneCheck = 0;

        request( this.listPage, function( error, response, html ){
            let $ = cheerio.load( html );
            let $teamsList = $( 'table' );

            $teamsList.each( function( teamsListIndex, element ){
                if( !$teamsList.eq( teamsListIndex ).attr( 'id' ) ){
                    $teamsList = $teamsList.eq( teamsListIndex ).find( 'ul' );
                    return false;
                }
            });

            $teamsList.each( function( outerListIndex, element ){
                let $currentListTeams = $teamsList.eq( outerListIndex ).find( 'li' );

                $currentListTeams.each( function( teamIndex, element ){
                    let $outerWrapper = $currentListTeams.eq( teamIndex ).find( 'span' ).first();
                    let $spans = $outerWrapper.find( 'span' );
                    let teamIdentifier = $spans.eq( 1 ).html().match( '/counterstrike/(.+?)"' )[ 1 ];

                    if( teamIdentifier.indexOf( 'index.php' ) <= -1 ){
                        _this.liquidTeams.push( teamIdentifier );
                    }
                });
            });

            for( let i = 0; i < _this.liquidTeams.length; i = i + 1 ){
                liquidpedia.exists( _this.liquidTeams[ i ], function( team ){
                    if( team.exists ){
                        _this.liquidTeams[ i ] = team.name;
                    }

                    doneCheck = doneCheck + 1;

                    console.log( doneCheck + '/' + _this.liquidTeams.length + ' done' );

                    if( doneCheck === _this.liquidTeams.length ){
                        _this.liquidDone = true;
                    }
                });
            }
        });
    }

    getLocalTeams(){
        let _this = this;
        jf.readFile( __dirname + '/../teams/all.json', function( error, data ){
            for( let index in data ){
                if( data[ index ].liquidpedia ){
                    _this.localTeams.push( data[ index ].liquidpedia );
                } else {
                    _this.localTeams.push( data[ index ].name );

                    if( data[ index ].gosugamers ){
                        _this.localTeams.push( data[ index ].gosugamers.name );
                    }

                    if( data[ index ].hltv ){
                        _this.localTeams.push( data[ index ].hltv.name );
                    }
                }
            }

            _this.localDone = true;
        } );
    }

    compareLiquidAndLocal(){
        if( !this.liquidDone || !this.localDone ){
            setTimeout( this.compareLiquidAndLocal.bind( this ), 100 );
            return false;
        }

        let missingTeams = [];

        for( let index in this.liquidTeams ){
            if( this.localTeams.indexOf( this.liquidTeams[ index ] ) <= -1 ){
                missingTeams.push( this.liquidTeams[ index ] );
            }
        }

        missingTeams.sort();

        console.log( missingTeams );
        console.log( 'A total of ' + missingTeams.length + ' teams missing from LiquidPedia noteworthy' );
        console.log( this.listPage );
    }

    run(){
        this.getLiquidTeams();
        this.getLocalTeams();

        this.compareLiquidAndLocal();
    }
}

let tmpMissing = new Missing();

tmpMissing.run();
