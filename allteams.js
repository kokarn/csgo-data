
const fs = require( 'fs' );
const archiver = require( 'archiver' );
const chalk = require( 'chalk' );

class AllTeams {
    constructor (){
        this.skipFiles = [ '.DS_Store' ];
    }

    generateZip( files ){
        let output = fs.createWriteStream( 'web/resources/all.zip' );
        let archive = archiver( 'zip' );

        archive.on( 'error', function( error ) {
            throw error;
        });

        archive.pipe( output );

        for( let index in files ){
            if( this.skipFiles.indexOf( files[ index ] ) !== -1 ){
                continue;
            }

            if( files[ index ].substr( -4 ) !== '.cfg' && files[ index ].substr( -4 ) !== '.png' ){
                continue;
            }

            if( files.hasOwnProperty( index ) ){
                archive.append(
                    fs.createReadStream(
                        'web/resources/ingame/' + files[ index ]
                    ), {
                        name: files[ index ]
                    }
                );
            }
        }

        archive.finalize();
    }

    generateFastdl( files ){
        let compressjs = require( 'compressjs' );
        let algorithm = compressjs.Bzip2;
        let output;
        let archive = archiver( 'zip' );
        let data;
        let compressed;
        let compressedBuffer;
        let bzip2List = [];
        let bzip2Name;

        for( let index in files ){
            if( this.skipFiles.indexOf( files[ index ] ) !== -1 ){
                continue;
            }

            if( files[ index ].substr( -4 ) !== '.png' ){
                continue;
            }

            if( files.hasOwnProperty( index ) ){
                bzip2Name = files[ index ] + '.bz2';
                data = fs.readFileSync( 'web/resources/ingame/' + files[ index ] );
                compressed = algorithm.compressFile( data );
                compressedBuffer = new Buffer( compressed );
                fs.writeFileSync( 'web/resources/ingame/' + bzip2Name, compressedBuffer );
                bzip2List.push( bzip2Name );
            }
        }

        output = fs.createWriteStream( 'web/resources/fastdl.zip' );

        archive.on( 'error', function( error ) {
            throw error;
        });

        archive.pipe( output );

        for( let index in bzip2List ){
            if( bzip2List.hasOwnProperty( index ) ){
                archive.append(
                    fs.createReadStream(
                        'web/resources/ingame/' + bzip2List[ index ]
                    ), {
                        name: bzip2List[ index ]
                    }
                );
            }
        }

        archive.finalize();

        for( let index in bzip2List ){
            if( bzip2List.hasOwnProperty( index ) ){
                fs.unlink( 'web/resources/ingame/' + bzip2List[ index ] );
            }
        }
    }

    run (){
        console.log( 'Starting all teams build' );
        let files = fs.readdirSync( 'web/resources/ingame/' );

        this.generateZip( files );

        this.generateFastdl( files );

        console.log( chalk.green( 'Done with all teams build' ) );
    }
}

let currentAllTeams = new AllTeams();

currentAllTeams.run();
