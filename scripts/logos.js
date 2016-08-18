'use strict';

var fs = require( 'fs' ),
    jsonfile = require( 'jsonfile' ),
    sizeOf = require( 'image-size' ),
    chalk = require( 'chalk' ),
    missingLogos = {
        lowresLogos : [],
        teamsChecked : 0,
        invalidImages : 0,
        markdown : '|Image|Team|Current size|\n|---|---|---|\n',
        start: function(){
            this.teams = fs.readdirSync( 'teams/' );
            this.checkAllLogoSizes();
        },
        checkAllLogoSizes: function(){
            for( var i = 0; i < this.teams.length; i = i + 1 ){
                this.checkLogoSize( this.teams[ i ] );
            }
        },

        checkLogoSize: function( teamName ){
            var _this = this;

            fs.readdir( 'teams/' + teamName, function( error, files ){
                if( files === undefined ){
                    return false;
                }

                files.forEach( function( filename ){
                    var data,
                        dimensionString,
                        properFilename,
                        dimensions,
                        filenameFullPath = 'teams/' + teamName + '/' + filename;

                    if( filename.substr( 0, 4 ) !== 'logo' || filename.substr( -4 ) !== '.png' ){
                        return false;
                    }

                    dimensions = sizeOf( filenameFullPath );

                    if( dimensions.width >= 500 && dimensions.height >= 500 ) {
                        dimensionString = 'highres';
                    } else {
                        dimensionString = dimensions.width + 'x' + dimensions.height;
                    }

                    properFilename = 'logo-' + dimensionString + '.png';

                    if( properFilename !== filename ){
                        console.log( chalk.yellow( 'Renaming', filenameFullPath, 'to',  'teams/' + teamName + '/' + properFilename ) );
                        fs.renameSync( filenameFullPath, 'teams/' + teamName + '/' + properFilename );
                        filename = properFilename;
                    }

                    if( dimensions.width !== dimensions.height ){
                        console.log( chalk.red( filenameFullPath, 'is not square! It\'s ' + dimensions.width + 'x' + dimensions.height ) );
                        _this.invalidImages = _this.invalidImages + 1;
                    }

                    if( filename.indexOf( 'highres' ) === -1 ){
                        data = jsonfile.readFileSync( 'teams/' + teamName + '/data.json' );
                        _this.lowresLogos.push({
                            name: teamName,
                            size: dimensions.width,
                            image: '![logo](https://github.com/kokarn/csgo-data/raw/master/web/resources/ingame/' + data.steam.name + '.png)'
                        });
                    }

                    _this.teamsChecked = _this.teamsChecked + 1;
                });

                _this.checkDone();
            });
        },
        checkDone : function(){
            var _this = this;

            if( _this.teamsChecked == _this.teams.length - 1 ){

                _this.lowresLogos.sort( function( obj1, obj2 ){
                    if( obj1.size !== obj2.size ){
                        return obj1.size - obj2.size;
                    }

                    return obj1.name.localeCompare( obj2.name );
                } );

                _this.lowresLogos.forEach( function( data ){
                    _this.markdown = _this.markdown + '|' + data.image + '|' + data.name + '|' + data.size + '|\n';
                });

                fs.writeFile( 'logos-missing.md', _this.markdown, function( error ){
                    if( error ){
                        console.log( chalk.red( error ) );
                    } else {
                        if( _this.invalidImages > 0 ){
                            console.log( chalk.red( 'Found some invalid images. Please fix this and then re-run.' ) );
                            process.exit( 1 );
                        }

                        console.log( chalk.green( 'Images done' ) );
                    }
                });
            }

        }
    };

missingLogos.start();
