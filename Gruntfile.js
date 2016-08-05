module.exports = function( grunt ) {
    var jf = require( 'jsonfile' );

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
            }
        }
    });

    grunt.loadNpmTasks( 'grunt-newer' );
    grunt.loadNpmTasks( 'grunt-jimp' );
    grunt.loadNpmTasks( 'grunt-contrib-jshint' );

    grunt.registerTask( 'default', [ 'newer:jimp:ingame' ] );
};
