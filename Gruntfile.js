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
                        var data = jf.readFileSync( 'teams/' + src.split( '/' )[ 0 ] + '/data.json' );
                        return dest + data.steam.name + '.png';
                    }
                }]
            },
            match : {
                options : {
                    sizes : [{
                        name : '500x500',
                        height : 500,
                        width: 500,
                        rename: false,
                        aspectRatio: false
                    }]
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
            },
            teams: {
                options: {
                    optimizationLevel: 4
                },
                files: [{
                    expand: true,
                    cwd: 'web/resources/teams/',
                    src: [ '*.png' ],
                    dest: 'web/resources/teams/'
                }]
            }
        }
    });

    grunt.loadTasks( 'tasks' );

    grunt.loadNpmTasks( 'grunt-newer' );
    grunt.loadNpmTasks( 'grunt-contrib-imagemin' );
    grunt.loadNpmTasks( 'grunt-responsive-images' );
    grunt.loadNpmTasks( 'grunt-contrib-jshint' );

    grunt.registerTask( 'default', [ 'newer:imagemin:source', 'newer:responsive_images:ingame', 'newer:responsive_images:match', 'newer:imagemin:ingame', 'newer:imagemin:teams', 'teams', 'teams_zip' ] );
};
