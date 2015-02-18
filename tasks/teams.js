module.exports = function( grunt ) {
    'use strict';
    var fs = require( 'fs' ),
        archiver = require( 'archiver' ),
        normalizeForSearch = require( 'normalize-for-search' ),
        skipFiles = [ '.DS_Store' ];

    function createIdentifier( name ){
        return normalizeForSearch( name.replace( /[\s\.\-]+/g, '' ) );
    }

    function checkIdentifier( teamData ){
        if( typeof teamData.identifier === 'undefined' ){
            teamData.identifier = createIdentifier( teamData.name );

            fs.writeFile( 'teams/' + teamData.name + '/data.json', JSON.stringify( teamData, null, 4 ), function( error ) {
                if( error ) {
                    console.log( error );
                }
            });
        }

        return teamData;
    }

    function writeZip( identifier ){
        var output = fs.createWriteStream( 'web/teams/' + identifier + '.zip' ),
            archive = archiver( 'zip' );

        archive.on( 'error', function( error ) {
            throw error;
        });

        archive.pipe( output );

        archive
            .append( fs.createReadStream( 'web/teams/' + identifier + '.cfg' ), {
                    name: identifier + '.cfg'
                }
            )
            .append( fs.createReadStream( 'web/teams/' + identifier + '.png' ), {
                    name: identifier + '.png'
                }
            )
            .finalize();
    }

    function writeCfg( identifier, cfgData, createZip ){
        fs.writeFile( 'web/teams/' + identifier + '.cfg', cfgData, function( error ){
            if( error ){
                console.log( error );
            } else {
                if( createZip ) {
                    writeZip( identifier );
                }
            }
        });
    }

    function createCfg( teamData ){
        var cfgData = teamData.name + "\n";

        writeCfg( teamData.identifier, cfgData, true );

    }

    grunt.registerTask( 'teams', function() {
        var teams = fs.readdirSync( 'teams' ),
            index;

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
                        createCfg( teamData );
                    }
                });
            }
        }
    });
};
