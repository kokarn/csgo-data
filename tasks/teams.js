module.exports = function( grunt ) {
    'use strict';
    var fs = require( 'fs-extra' ),
        AdmZip = require( 'adm-zip' ),
        archiver = require( 'archiver' ),
        jf = require( 'jsonfile' ),
        skipFiles = [ '.DS_Store', 'all.json' ],
        done,
        doneJobs = 0,
        totalJobs,
        teamList = {};

    function checkIdentifier( teamData ){
        if( teamData.identifier === undefined ){
            teamData.identifier = createIdentifier( teamData.name );

            fs.writeFile( 'teams/' + teamData.name + '/data.json', JSON.stringify( teamData, null, 4 ), function( error ) {
                if( error ) {
                    console.log( error );
                }
            });
        }

        return teamData;
    }

    function checkAllDone(){
        if( doneJobs === totalJobs ){
            writeTeamList();
        }
    }

    function writeZip( identifier ){
        var output = fs.createWriteStream( 'web/resources/ingame/' + identifier + '.zip' ),
            archive = archiver( 'zip' );

        archive.on( 'error', function( error ) {
            throw error;
        });

        archive.pipe( output );

        archive
            .append( fs.createReadStream( 'web/resources/ingame/' + identifier + '.cfg' ), {
                    name: identifier + '.cfg'
                }
            )
            .append( fs.createReadStream( 'web/resources/ingame/' + identifier + '.png' ), {
                    name: identifier + '.png'
                }
            )
            .finalize();

        doneJobs = doneJobs + 1;

        checkAllDone();
    }

    function writeCfg( identifier, cfgData ){
        fs.writeFile( 'web/resources/ingame/' + identifier + '.cfg', cfgData, function( error ){
            if( error ){
                console.log( error );
                done( false );
            } else {
                writeZip( identifier );
            }
        });
    }

    function createCfg( teamData ){
        var cfgData = teamData.name + "\n";

        writeCfg( teamData.steam.name, cfgData );

        doneJobs = doneJobs + 1;
    }

    function writeTeamList(){
        var sortedList = {},
            identifierList = [];

        for( var identifier in teamList ){
            if( teamList.hasOwnProperty( identifier ) ){
                identifierList.push( identifier );
            }
        }

        identifierList.sort();

        for( var index = 0; index < identifierList.length; index = index + 1 ){
            sortedList[ identifierList[ index ] ] = teamList[ identifierList[ index ] ];
        }

        fs.writeFile( 'teams/all.json', JSON.stringify( sortedList, null, 4 ), function( error ){
            if( error ){
                console.log( error );
                done( false );
            } else {
                fs.copy( 'teams/all.json', 'web/resources/teamlist.json', function( error ){
                    if( error ) {
                        console.log( error );
                        done( false );
                    } else {
                        done();
                    }
                });
            }
        });
    }

    grunt.registerTask( 'teams', function() {
        var teams = fs.readdirSync( 'teams' ),
            index;

        done = this.async();

        totalJobs = teams.length;

        for( index in teams ){
            if( teams.hasOwnProperty( index ) ){
                if( skipFiles.indexOf( teams[ index ] ) !== -1 ){
                    continue;
                }

                jf.readFile( 'teams/' + teams[ index ] + '/data.json', function( error, teamData ){
                    if( error ){
                        throw error;
                    }
                    teamData = checkIdentifier( teamData );
                    teamList[ teamData.identifier ] = teamData;

                    let zipfilename = 'web/resources/ingame/' + teamData.steam.name + '.zip';

                    fs.stat( zipfilename, function( error, stats ){
                        if( error ){
                            // File doesn't exist
                            createCfg( teamData );

                            return true;
                        }

                        var zip = new AdmZip( zipfilename );
                        var zipEntries = zip.getEntries();

                        zipEntries.forEach( function( zipEntry ) {
                            if ( zipEntry.entryName === teamData.steam.name + '.png' ) {
                                zip.readFileAsync( zipEntry, function( zipLogo ){
                                    fs.readFile( 'web/resources/ingame/' + teamData.steam.name + '.png', function( error, storedLogo ){
                                        if( error ){
                                            throw error;
                                        }

                                        if( zipLogo.equals( storedLogo ) ){
                                            return true;
                                        }

                                        // Logos are not equal
                                        createCfg( teamData );

                                        return true;
                                    });
                                });
                            }
                        });
                    })
                });
            }
        }
    });
};
