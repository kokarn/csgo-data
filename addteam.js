#! /usr/bin/env node

var http = require( 'http' ),
    https = require( 'https' ),
    chalk = require( 'chalk' ),
    fs = require( 'fs' ),
    readline = require( 'readline' ),
    cheerio = require( 'cheerio' ),
    fileType = require( 'file-type' ),
    exec = require( 'child_process' ),
    request = require( 'request' ),
    gosugamers = require( './gosugamers' ),
    logoFilename = '',
    addTeam = {
        rl : false,
        state: 0,
        teamData : {},
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
        setInitialGosugamers : function( searchPhrase ){
            gosugamers.search( searchPhrase, function( teams ){
                if( teams.length > 0 ){
                    addTeam.teamData.gosugamers = teams[ 0 ];
                }
            } );
        },
                }
            });
        },
        searchGosugamers : function( searchPhrase ){
            'use strict';
            gosugamers.search( searchPhrase, function( teams ){
                var i;

                if( teams.length <= 0 ){
                    console.log( 'Could not find any teams matching "' + searchPhrase + '". ' );
                    addTeam.rl.question( 'Please enter another search term or enter to cancel ', function( answer ) {
                        if( answer.length <= 0 ){
                            addTeam.finish();
                        } else {
                            addTeam.searchGosugamers( answer );
                        }
                    });
                } else {
                    for( i = 0; i < teams.length; i = i + 1 ){
                        console.log( parseInt( i + 1, 10 ) + ': ' + teams[ i ].name );
                    }

                    addTeam.rl.question( 'Select the correct team, if none match, enter 0. To cancel, press Enter ', function( answer ) {
                        if( answer.length <= 0 ){
                            addTeam.finish();
                        } else if( answer === '0' ){
                            addTeam.rl.question( 'Please enter a search term ', function( answer ) {
                                addTeam.searchGosugamers( answer );
                            });
                        } else {
                            addTeam.teamData.gosugamers = teams[ i ];
                            addTeam.finish();
                        }
                    });
                }
            } );
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
                    addTeam.rl.question( 'Open logo for editing (Y/N)? ', function( answer ) {
                        switch( answer ){
                            case 'y':
                            case 'Y':
                                addTeam.watchLogo();
                                exec.execSync( 'open "' + addTeam.logoFilename + '"' );
                                break;
                            default:
                                addTeam.runGrunt();
                                break;
                        }
                    });
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
        runGrunt: function(){
            var child = exec.spawn( 'grunt', [], { stdio: 'inherit' } );

            child.on( 'exit', function(){
                process.exit();
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
        setSteamName: function(){
            addTeam.rl.question( 'What should be the steam identifier? ', function( answer ) {
                if( answer.length > 0 && answer.length <= 5 ){
                    addTeam.teamData.steam = {
                        'name': answer
                    };
                    addTeam.addLogo();
                } else {
                    console.log( 'The length needs to be more than 0 and less than 5' );
                    addTeam.setSteamName();
                }
            });
        },
        addLogo : function(){
            var writeTarget = 'teams/' + addTeam.teamData.name + '/logo',
                writeStream = fs.createWriteStream( writeTarget ),
                request,
                extension,
                protocol;

            addTeam.rl.question( 'URL to the logo? ', function( url ) {
                if( url.substr( 0, 5 ) === 'https' ){
                    protocol = https;
                } else {
                    protocol = http;
                }

                request = protocol.get( url, function( response ) {

                    response.once( 'data', function( chunk ) {
                        extension = fileType( chunk ).ext;
                        addTeam.logoFilename = writeTarget + '.' + extension;
                    });

                    response.on( 'end', function() {
                        fs.rename( writeTarget, addTeam.logoFilename, function( error ) {
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
        watchLogo : function(){
            'use strict';
            var sizeOf = require( 'image-size' ),
                dimensions,
                newFilename,
                dimensionString = '';

            console.log( 'watching ' + addTeam.logoFilename );

            fs.watch( addTeam.logoFilename, function( event, filename ) {
                console.log( 'Logo changed, setting new logo name.' );

                dimensions = sizeOf( addTeam.logoFilename );

                if( dimensions.width >= 500 && dimensions.height >= 500 ) {
                    dimensionString = 'highres';
                } else {
                    dimensionString = dimensions.width + 'x' + dimensions.height;
                }

                newFilename = addTeam.logoFilename.replace( 'logo.', 'logo-' + dimensionString + '.' );

                fs.rename( addTeam.logoFilename, newFilename , function( error ) {
                    if( error ) {
                        console.log( 'ERROR: ' + error );
                    }

                    addTeam.runGrunt();
                });
            });
        },
        createTeam : function( teamName ){
            'use strict';

            addTeam.teamData.name = teamName;
            addTeam.setInitialGosugamers( addTeam.teamData.name );
            addTeam.ensureExists( 'teams/' + addTeam.teamData.name, function( error ) {
                if( error ){
                    console.log( error );
                } else {
                    addTeam.setSteamName();
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
