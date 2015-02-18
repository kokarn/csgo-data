module.exports = function( grunt ) {
    'use strict';
    var fs = require( 'fs' ),
        archiver = require( 'archiver' ),
        skipFiles = [ '.DS_Store' ];

    grunt.registerTask( 'teams_zip', function() {
        var output = fs.createWriteStream( 'web/all.zip' ),
            archive = archiver( 'zip' ),
            files = fs.readdirSync( 'web/teams/' ),
            done = this.async(),
            index;

        archive.on( 'error', function( error ) {
            throw error;
        });

        archive.pipe( output );

        for( index in files ){
            if( skipFiles.indexOf( files[ index ] ) !== -1 ){
                continue;
            }

            if( files[ index ].substr( -4 ) !== '.cfg' && files[ index ].substr( -4 ) !== '.png' ){
                continue;
            }

            if( files.hasOwnProperty( index ) ){
                archive.append(
                    fs.createReadStream(
                        'web/teams/' + files[ index ]
                    ), {
                        name: files[ index ]
                    }
                )
            }
        }

        archive.finalize();
    });
};
