'use strict';

var fs = require( 'fs' ),
    jsonfile = require( 'jsonfile' ),
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
                _this.teamsChecked = _this.teamsChecked + 1;

                if( files === undefined ){
                    return false;
                }

                files.forEach( function( filename ){
                    var size,
                        data;

                    if( filename.substr( 0, 4 ) === 'logo' && filename.substr( -4 ) == '.png' ){
                        size = filename.substr( 5, 3 );
                        if( size !== 'hig' ){
                            data = jsonfile.readFileSync( 'teams/' + teamName + '/data.json' );
                            _this.lowresLogos.push({
                                name: teamName,
                                size: parseInt( size, 10 ),
                                image: '![logo](https://github.com/kokarn/csgo-data/raw/master/web/resources/ingame/' + data.steam.name + '.png)'
                            });
                        }
                    }
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
