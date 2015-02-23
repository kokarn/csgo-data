module.exports = function( grunt ) {

    global[ 'createIdentifier' ] = function ( name ){
        var normalizeForSearch = require( 'normalize-for-search' );
        return normalizeForSearch( name.replace( /[\s\.\-]+/g, '' ) );
    }

    grunt.initConfig({
        responsive_images: {
            options : {
                newFilesOnly: false,
            },
            ingame : {
                options : {
                    sizes : [{
                        name : 'ingame',
                        height : 64,
                        width: 64,
                        rename: false,
                        aspectRatio: false
                    }]
                },
                files : [{
                    expand: true,
                    cwd: 'teams/',
                    src: [ '**/*.png' ],
                    dest: 'web/resources/ingame/',
                    rename: function( dest, src ){
                        return dest + createIdentifier( src.split( '/' )[ 0 ] ) + '.png';
                    }
                }]
            },
            match : {
                options : {
                    sizes : [{
                        name : '500x500',
                        height : 500,
                        width: 500,
                        aspectRatio: false
                    }]
                },
                files : [{
                    expand: true,
                    cwd: 'teams/',
                    src: [ '**/*.png' ],
                    dest: 'web/resources/teams/',
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
                    cwd: 'web/resources/ingame/',
                    src: [ '*.png' ],
                    dest: 'web/resources/ingame/'
                }]
            }
        }
    });

    grunt.loadTasks( 'tasks' );

    grunt.loadNpmTasks( 'grunt-newer' );
    grunt.loadNpmTasks( 'grunt-contrib-imagemin' );
    grunt.loadNpmTasks( 'grunt-responsive-images' );

    grunt.registerTask( 'default', [ 'newer:imagemin:source', 'newer:responsive_images:ingame', 'newer:imagemin:ingame', 'teams', 'teams_zip' ] );
};
