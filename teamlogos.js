#! /usr/bin/env node

var jimp = require( 'jimp' ),
    readline = require( 'readline' ),
    fs = require( 'fs' ),
    teamLogos = {
        rl : false,
        outputPath : 'logos/',
        state: 0,
        skipDirs : [ '.DS_Store' ],
        teams : [],
        logosDone : 0,
        getSize : function(){
            teamLogos.rl.question( 'Size in pixels, please? ', function( size ) {
                size = parseInt( size, 10 );
                if( size > 0 ){
                    teamLogos.size = size;
                    teamLogos.process();
                } else {
                    console.log( 'That is not a valid size, please try again' );
                    teamLogos.getSize();
                }
            });
        },
        createIdentifier : function( name ){
            var normalizeForSearch = require( 'normalize-for-search' );
            return normalizeForSearch( name.replace( /[\s\.\-]+/g, '' ) );
        },
        process : function(){
            fs.mkdir( teamLogos.outputPath, 0777, function( error ){
                if( error ){
                    if( error.code == 'EEXIST' ) {
                        // Ignore this
                    } else {
                        throw error;
                    }
                }

                teamLogos.teams.forEach( function( teamData ){
                    jimp.read( teamData.logoPath, function( error, image ){
                        var targetFilename = teamLogos.outputPath + teamLogos.createIdentifier( teamData.teamName ) + '-' + teamLogos.size + 'x' + teamLogos.size + teamData.extension;
                        if( error ){
                            console.log( teamData );
                            throw error;
                        } else {
                            image.resize( teamLogos.size, teamLogos.size )
                                .write( targetFilename );

                            teamLogos.logosDone = teamLogos.logosDone + 1;
                            teamLogos.followProgress();
                        }
                    });
                });
            });

            teamLogos.followProgress();
        },
        getLogoPaths : function(){
            fs.readdir( 'teams', function( error, files ){
                files.forEach( function( teamName ){
                    var teamPath = 'teams/' + teamName;

                    if( teamLogos.skipDirs.indexOf( teamName ) !== -1 ){
                        return false;
                    }

                    fs.lstat( teamPath, function( error, stats ){
                        if( !stats.isDirectory() ){
                            return false;
                        }

                        fs.readdir( teamPath, function( error, teamFiles ){
                            if( error ){
                                throw error
                            } else {
                                teamFiles.forEach( function( filename ){
                                    var extension = filename.substr( filename.lastIndexOf( '.' ) );

                                    if( filename.indexOf( 'logo' ) > -1 && extension !== '.svg' ){
                                        teamLogos.teams.push( {
                                            logoPath: teamPath + '/' + filename,
                                            teamName: teamName,
                                            extension: extension
                                        });
                                    }
                                });
                            }
                        });

                    });
                });
            });
        },
        followProgress : function(){
            if( teamLogos.logosDone < teamLogos.teams.length ){
                console.log( teamLogos.logosDone + ' out of ' + teamLogos.teams.length + ' done' );
            } else {
                console.log( 'All done! You can now find your teamlogos in "' + teamLogos.outputPath + '"' );
                process.exit();
            }
        },
        setupReadLine : function(){
            if( teamLogos.rl === false ) {
                teamLogos.rl = readline.createInterface({
                    input: process.stdin,
                    output: process.stdout
                }),

                teamLogos.rl.on( 'SIGINT', function() {
                    if( teamLogos.state !== 0 ){
                        teamLogos.rl.close();
                        teamLogos.rl = false;
                        teamLogos.start();
                    } else {
                        console.log();
                        process.exit();
                    }
                });
            }
        },
        start : function(){
            'use strict';

            teamLogos.setupReadLine();
            teamLogos.getLogoPaths();
            teamLogos.getSize();
        }
    };

teamLogos.start();
