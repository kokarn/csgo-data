'use strict';

var fs = require( 'fs' ),
    jsonfile = require( 'jsonfile' ),
    sizeOf = require( 'image-size' ),
    missingLogos = {
        lowresLogos : [],
        sortedLogos : [],
        teamsChecked : 0,
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
                        console.log( 'Renaming', filenameFullPath, 'to',  'teams/' + teamName + '/' + properFilename );
                        fs.renameSync( filenameFullPath, 'teams/' + teamName + '/' + properFilename );
                        filename = properFilename;
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
                _this.lowresLogos.forEach( function( data ){
                    var i,
                        hasAdded = false;

                    for( i = 0; i < _this.sortedLogos.length; i = i + 1 ){
                        if( data.size < _this.sortedLogos[ i ].size ){
                            _this.sortedLogos.splice( i, 0, data );
                            hasAdded = true;
                            break;
                        }
                    }

                    if( !hasAdded ){
                        _this.sortedLogos.push( data );
                    }

                });

                _this.sortedLogos.forEach( function( data ){
                    _this.markdown = _this.markdown + '|' + data.image + '|' + data.name + '|' + data.size + '|\n';
                });

                fs.writeFile( 'logos-missing.md', _this.markdown, function( error ){
                    if( error ){
                        console.log( error );
                    } else {
                        console.log( 'Missing logos updated' );
                    }
                });
            }

        }
    };

missingLogos.start();
