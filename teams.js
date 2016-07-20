const fs = require( 'fs-extra' );
const AdmZip = require( 'adm-zip' );
const archiver = require( 'archiver' );
const jf = require( 'jsonfile' );
const chalk = require( 'chalk' );

class Teams {
    constructor (){
        this.skipFiles = [ '.DS_Store', 'all.json' ];
        this.doneJobs = 0;

        this.teamList = {};
    }

    checkIdentifier( teamData ){
        if( teamData.identifier === undefined ){
            teamData.identifier = this.createIdentifier( teamData.name );

            fs.writeFile( 'teams/' + teamData.name + '/data.json', JSON.stringify( teamData, null, 4 ), function( error ) {
                if( error ) {
                    throw error;
                }
            });
        }

        return teamData;
    }

    checkAllDone(){
        console.log( 'Done', this.doneJobs, '/', this.totalJobs );
        if( this.doneJobs === this.totalJobs ){
            this.writeTeamList();
        }
    }

    writeZip( identifier ){
        let output = fs.createWriteStream( 'web/resources/ingame/' + identifier + '.zip' );
        let archive = archiver( 'zip' );

        archive.on( 'error', function( error ) {
            throw error;
        });

        archive.pipe( output );

        archive
            .append( fs.createReadStream( 'web/resources/ingame/' + identifier + '.cfg' ), {
                    name: identifier + '.cfg'
                }
            )
            .append( fs.createReadStream( 'web/resources/ingame/' + identifier + '.png' ), {
                    name: identifier + '.png'
                }
            )
            .finalize();

        this.doneJobs = this.doneJobs + 1;

        this.checkAllDone();
    }

    writeCfg( identifier, cfgData ){
        let _this = this;

        fs.writeFile( 'web/resources/ingame/' + identifier + '.cfg', cfgData, function( error ){
            if( error ){
                throw error;
            }

            _this.writeZip( identifier );
        });
    }

    createCfg( teamData ){
        let cfgData = teamData.name + "\n";

        this.writeCfg( teamData.steam.name, cfgData );
    }

    writeTeamList(){
        let sortedList = {};
        let identifierList = [];

        for( let identifier in this.teamList ){
            if( this.teamList.hasOwnProperty( identifier ) ){
                identifierList.push( identifier );
            }
        }

        identifierList.sort();

        for( let index = 0; index < identifierList.length; index = index + 1 ){
            sortedList[ identifierList[ index ] ] = this.teamList[ identifierList[ index ] ];
        }

        fs.writeFile( 'teams/all.json', JSON.stringify( sortedList, null, 4 ), function( error ){
            if( error ){
                throw error;
            }

            fs.copy( 'teams/all.json', 'web/resources/teamlist.json', function( error ){
                if( error ) {
                    throw error;
                }

                console.log( chalk.green( 'Done with teambuilding!' ) );
            });
        });
    }

    run (){
        console.log( 'Starting teams' );
        let _this = this;
        let teamList = fs.readdirSync( 'teams' );

        this.totalJobs = teamList.length;

        for( let index in teamList ){
            if( teamList.hasOwnProperty( index ) ){
                if( this.skipFiles.indexOf( teamList[ index ] ) !== -1 ){
                    this.totalJobs = this.totalJobs - 1;
                    continue;
                }

                jf.readFile( 'teams/' + teamList[ index ] + '/data.json', function( error, teamData ){
                    if( error ){
                        throw error;
                    }

                    teamData = _this.checkIdentifier( teamData );
                    _this.teamList[ teamData.identifier ] = teamData;

                    let zipfilename = 'web/resources/ingame/' + teamData.steam.name + '.zip';

                    fs.access( zipfilename, function( error ){
                        if( error ){
                            // File doesn't exist
                            _this.createCfg( teamData );

                            return true;
                        }

                        var zip = new AdmZip( zipfilename );
                        var zipEntries = zip.getEntries();

                        zipEntries.forEach( function( zipEntry ) {
                            if ( zipEntry.entryName !== teamData.steam.name + '.png' ) {
                                return;
                            }

                            zip.readFileAsync( zipEntry, function( zipLogo ){
                                fs.readFile( 'web/resources/ingame/' + teamData.steam.name + '.png', function( error, storedLogo ){
                                    if( error ){
                                        throw error;
                                    }

                                    if( zipLogo.equals( storedLogo ) ){
                                        _this.doneJobs = _this.doneJobs + 1;
                                        _this.checkAllDone();
                                        return true;
                                    }

                                    // Logos are not equal
                                    _this.createCfg( teamData );

                                    return true;
                                });
                            });
                        });
                    })
                });
            }
        }
    }
}

let currentTeams = new Teams();

currentTeams.run();
