module.exports = function( grunt ) {
    'use strict';
    var fs = require( 'fs' ),
        archiver = require( 'archiver' ),
        skipFiles = [ '.DS_Store' ],
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

    function writeCfg( identifier, cfgData, createZip ){
        fs.writeFile( 'web/resources/ingame/' + identifier + '.cfg', cfgData, function( error ){
            if( error ){
                console.log( error );
                done( false );
            } else {
                if( createZip ) {
                    writeZip( identifier );
                } else {
                    doneJobs = doneJobs + 1;
                }
            }
        });
    }

    function createCfg( teamData ){
        var cfgData = teamData.name + "\n";

        writeCfg( teamData.identifier, cfgData, true );

        if( teamData.steam !== undefined ){
            if( teamData.steam.name !== teamData.identifier ){
                writeCfg( teamData.steam.name, cfgData, false );
            } else {
                doneJobs = doneJobs + 1;
            }
        } else {
            doneJobs = doneJobs + 1;
        }
    }

    function writeTeamList(){
        fs.writeFile( 'web/resources/teamlist.json', JSON.stringify( teamList, null, 4 ), function( error ){
            if( error ){
                console.log( error );
                done( false );
            } else {
                done();
            }
        });
    }

    grunt.registerTask( 'teams', function() {
        var teams = fs.readdirSync( 'teams' ),
            index;

        done = this.async();

        totalJobs = teams.length;

        for( index in teams ){
            if( skipFiles.indexOf( teams[ index ] ) !== -1 ){
                continue;
            }

            if( teams.hasOwnProperty( index ) ){
                fs.readFile( 'teams/' + teams[ index ] + '/data.json', 'utf8', function( error, data ){
                    var teamData;
                    if( error ){
                        throw error;
                    } else {
                        teamData = JSON.parse( data );
                        teamData = checkIdentifier( teamData );
                        teamList[ teamData.identifier ] = teamData.name;
                        createCfg( teamData );
                    }
                });
            }
        }
    });
};
