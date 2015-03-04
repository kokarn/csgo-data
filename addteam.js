#! /usr/bin/env node

var http = require( 'http' ),
    chalk = require( 'chalk' ),
    fs = require( 'fs' ),
    readline = require( 'readline' ),
    jsdom = require( 'jsdom' ),
    fileType = require( 'file-type' ),
    addTeam = {
        rl : false,
        state: 0,
        teamData : {},
        gosugamersBaseUrl : 'http://www.gosugamers.net/counterstrike/rankings?tunranked=0&tunranked=1&tname=',
        ensureExists: function( path, mask, callback ) {
            if( typeof mask == 'function' ) { // allow the `mask` parameter to be optional
                callback = mask;
                mask = 0777;
            }

            fs.mkdir( path, mask, function( error ) {
                if( error ) {
                    if( error.code == 'EEXIST' ) {
                        callback( null ); // ignore the error if the folder already exists
                    } else {
                        callback( error ); // something else went wrong
                    }
                } else {
                    callback( null ); // successfully created folder
                }
            });
        },
        setGosugamers : function( searchPhrase, index, callback ){
            'use strict';

            jsdom.env(
                addTeam.gosugamersBaseUrl + searchPhrase,
                [ 'http://code.jquery.com/jquery.js' ],
                function( errors, window ) {
                    if( window.$( '.ranking-link' ).eq( index ).length > 0 ){
                        addTeam.teamData.gosugamers = {
                            id: window.$( '.ranking-link' ).eq( index ).data( 'id' ),
                            name: window.$( '.ranking-link' ).eq( index ).find( 'h4' ).text().trim()
                        };
                    }

                    if( typeof callback === 'function' ){
                        callback.call();
                    }
                }
            );
        },
        searchGosugamers : function( searchPhrase ){
            'use strict';

            jsdom.env(
                addTeam.gosugamersBaseUrl + searchPhrase,
                [ 'http://code.jquery.com/jquery.js' ],
                function( errors, window ) {
                    if( errors ){
                        console.log( errors );
                    }
                    var $teams = window.$( '.ranking-link' );

                    if( $teams.length <= 0 ){
                        console.log( 'Could not find any teams matching "' + searchPhrase + '". ' );
                        addTeam.rl.question( 'Please enter another search term or enter to cancel ', function( answer ) {
                            if( answer.length <= 0 ){
                                addTeam.finish();
                            } else {
                                addTeam.searchGosugamers( answer );
                            }
                        });
                    } else {
                        window.$.each( $teams, function( index, element ){
                            console.log( parseInt( index + 1, 10 ) + ': ' + $teams.eq( index ).find( 'h4' ).text().trim() );
                        });

                        addTeam.rl.question( 'Select the correct team, if none match, enter 0. To cancel, press Enter ', function( answer ) {
                            if( answer.length <= 0 ){
                                addTeam.finish();
                            } else if( answer === '0' ){
                                addTeam.rl.question( 'Please enter a search term ', function( answer ) {
                                    addTeam.searchGosugamers( answer );
                                });
                            } else {
                                addTeam.setGosugamers( searchPhrase, parseInt( answer - 1, 10 ), addTeam.finish );
                            }
                        });
                    }
                }
            );
        },
        changeData : function(){
            console.log( '1: Name' );
            console.log( '2: CSGOLounge' );
            console.log( '3: Gosugamers' );

            addTeam.rl.question( 'What do you want to change? ', function( answer ) {
                switch( answer ){
                    case '1':
                        addTeam.setTeamName();
                        break;
                    case '2':
                        addTeam.csGoLoungeName();
                        break;
                    case '3':
                        addTeam.searchGosugamers( addTeam.teamData.name );
                        break;
                    default:
                        addTeam.finish();
                        break;
                }
            });
        },
        writeData : function(){
            fs.writeFile( 'teams/' + addTeam.teamData.name + '/data.json', JSON.stringify( addTeam.teamData, null, 4 ), function( error ){
                if( error ){
                    console.log( error );
                } else {
                    console.log( 'Team data written successfully' );
                    addTeam.setTeamName();
                }
            });
        },
        finish: function(){
            console.log( JSON.stringify( addTeam.teamData, null, 4 ) );
            addTeam.rl.question( 'Is this correct? (Y/N) ', function( answer ) {
                switch( answer ){
                    case 'n':
                    case 'N':
                        addTeam.changeData();
                        break;
                    case 'y':
                    case 'Y':
                        addTeam.writeData();
                        break;
                }
            });
        },
        csGoLoungeName: function(){
            addTeam.rl.question( 'What is the name of the team on CSGOLounge? ', function( answer ) {
                if( answer.length > 0 ){
                    addTeam.teamData.csgolounge = {
                        'name': answer
                    };
                }

                addTeam.finish();
            });
        },
        addLogo : function(){
            var writeTarget = 'teams/' + addTeam.teamData.name + '/logo',
                writeStream = fs.createWriteStream( writeTarget ),
                request,
                extension;

            addTeam.rl.question( 'URL to the logo? ', function( url ) {
                request = http.get( url, function( response ) {

                    response.once( 'data', function( chunk ) {
                        extension = fileType( chunk ).ext;
                    });

                    response.on( 'end', function() {
                        fs.rename( writeTarget, writeTarget + '.' + extension, function( error ) {
                            if( error ) {
                                console.log( 'ERROR: ' + error );
                            }
                        });
                    });

                    response.pipe( writeStream );
                });

                addTeam.csGoLoungeName();
            });
        },
        createTeam : function( teamName ){
            'use strict';

            addTeam.teamData.name = teamName;
            addTeam.setGosugamers( addTeam.teamData.name, 0 );
            addTeam.ensureExists( 'teams/' + addTeam.teamData.name, function( error ) {
                if( error ){
                    console.log( error );
                } else {
                    addTeam.addLogo();
                }
            });
        },
        setupReadLine : function(){
            if( addTeam.rl === false ) {
                addTeam.rl = readline.createInterface({
                    input: process.stdin,
                    output: process.stdout
                }),

                addTeam.rl.on( 'SIGINT', function() {
                    if( addTeam.state !== 0 ){
                        addTeam.rl.close();
                        addTeam.rl = false;
                        addTeam.start();
                    } else {
                        console.log();
                        process.exit();
                    }
                });
            }
        },
        setTeamName : function(){
            addTeam.rl.question( 'What is the name of the team? ', function( answer ) {
                addTeam.createTeam( answer );
            });
        },
        start : function(){
            'use strict';

            addTeam.setupReadLine();
            addTeam.setTeamName();
        }
    };

addTeam.start();
