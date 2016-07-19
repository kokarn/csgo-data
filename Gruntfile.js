module.exports = function( grunt ) {
    var jf = require( 'jsonfile' );

    global[ 'createIdentifier' ] = function ( name ){
        var normalizeForSearch = require( 'normalize-for-search' );
        return normalizeForSearch( name.replace( /[\s\.\-]+/g, '' ) );
    };

    grunt.initConfig({
        jshint: {
            tasks: [
                'tasks/*.js'
            ]
        },
        jimp: {
            ingame : {
                options : {
                    actions : {
                        resize: [ 64, 64 ]
                    }
                },
                files : [{
                    expand: true,
                    cwd: 'teams/',
                    src: [ '**/*.png' ],
                    dest: 'web/resources/ingame/',
                    rename: function( dest, src ){
                        var data = jf.readFileSync( 'teams/' + src.split( '/' )[ 0 ] + '/data.json' );
                        return dest + data.steam.name + '.png';
                    }
                }]
            },
            match : {
                options : {
                    actions : {
                        resize: [ 500, 500 ]
                    }
                },
                files : [{
                    expand: true,
                    cwd: 'teams/',
                    src: [ '**/*.png' ],
                    dest: 'web/resources/teams/',
                    rename: function( dest, src ){
                        return dest + createIdentifier( src.split( '/' )[ 0 ] ) + '-500x500.png';
                    }
                }]
            }
        },
        run: {
            missingLogos: {
                cmd: 'node',
                args: [
                    'missing-logos.js'
                ]
            }
        }
    });

    grunt.loadTasks( 'tasks' );

    grunt.loadNpmTasks( 'grunt-newer' );
    grunt.loadNpmTasks( 'grunt-jimp' );
    grunt.loadNpmTasks( 'grunt-contrib-jshint' );
    grunt.loadNpmTasks( 'grunt-run' );

    grunt.registerTask( 'default', [ 'newer:jimp:ingame', 'newer:jimp:match', 'run:missingLogos', 'teams', 'teams_zip' ] );
};
