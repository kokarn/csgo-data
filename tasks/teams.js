module.exports = function( grunt ) {
    'use strict';
    var fs = require( 'fs' ),
        archiver = require( 'archiver' ),
        normalizeForSearch = require( 'normalize-for-search' );

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

    function createZip( teamData ){
        var output = fs.createWriteStream( 'web/teams/' + teamData.identifier + '.zip' ),
            archive = archiver( 'zip' );

        archive.on( 'error', function( error ) {
            throw error;
        });

        archive.pipe( output );

        archive
            .append( fs.createReadStream( 'web/teams/' + teamData.identifier + '.cfg' ), {
                    name: teamData.identifier + '.cfg'
                }
            )
            .append( fs.createReadStream( 'web/teams/' + teamData.identifier + '.png' ), {
                    name: teamData.identifier + '.png'
                }
            )
            .finalize();
    }

    function createCfg( teamData ){
        fs.writeFile( 'web/teams/' + teamData.identifier + '.cfg', teamData.name, function( error ){
            if( error ){
                console.log( error );
            } else {
                createZip( teamData );
            }
        });
    }

    grunt.registerTask( 'teams', function() {
        var teams = fs.readdirSync( 'teams' )
            var done = this.async(),
            index,
            skipFiles = [ '.DS_Store' ];

        for( index in teams ){
            if( skipFiles.indexOf( teams[ index ] ) !== -1 ){
                continue;
            }

            if( teams.hasOwnProperty( index ) ){
                fs.readFile( 'teams/' + teams[ index ] + '/data.json', 'utf8', function( error, data ){
                    var teamData;
                    if( error ){
                        throw error
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
