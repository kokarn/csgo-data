module.exports = function( grunt ) {

    global[ 'createIdentifier' ] = function ( name ){
        var normalizeForSearch = require( 'normalize-for-search' );
        return normalizeForSearch( name.replace( /[\s\.\-]+/g, '' ) );
    }

    grunt.initConfig({
        responsive_images: {
            options : {
                newFilesOnly: false,
                sizes : [{
                    name : 'ingame',
                    height : 64,
                    width: 64,
                    rename: false,
                    aspectRatio: false
                }]
            },
            default : {
                files : [{
                    expand: true,
                    cwd: 'teams/',
                    src: [ '**/*.png' ],
                    dest: 'web/teams/',
                    rename: function( dest, src ){
                        return dest + createIdentifier( src.split( '/' )[ 0 ] ) + '.png';
                    }
                }]
            }
        },
        imagemin: {
            source: {
                options: {
                    optimizationLevel: 4
                },
                files: [{
                    expand: true,
                    cwd: 'teams/',
                    src: [ '**/*.png' ],
                    dest: 'teams/'
                }]
            },
            ingame: {
                options: {
                    optimizationLevel: 4
                },
                files: [{
                    expand: true,
                    cwd: 'web/teams/',
                    src: [ '*.png' ],
                    dest: 'web/teams/'
                }]
            }
        }
    });

    grunt.loadTasks( 'tasks' );

    grunt.loadNpmTasks( 'grunt-newer' );
    grunt.loadNpmTasks( 'grunt-contrib-imagemin' );
    grunt.loadNpmTasks( 'grunt-responsive-images' );

    grunt.registerTask( 'teamdata', [ 'teams', 'teams_zip' ] );
    grunt.registerTask( 'default', [ 'newer:imagemin:source', 'newer:responsive_images', 'newer:imagemin:ingame', 'teamdata' ] );
};
