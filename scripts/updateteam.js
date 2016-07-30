#! /usr/bin/env node

var fs = require( 'fs' ),
    jsonfile = require( 'jsonfile' ),
    request = require( 'request' ),
    readlineSync = require( 'readline-sync' ),
    gosugamers = require( '../modules/gosugamers' ),
    hltv = require( '../modules/hltv' ),
    updateTeam = {
        skipFiles : [ '.DS_Store', 'all.json' ],
        teamsList : [],
        searchHltv : function( searchPhrase, identifier ){
            'use strict';
            hltv.search( searchPhrase, function( teams ){
                var i,
                    answer;

                if( teams.length <= 0 ){
                    console.log( 'Could not find any teams matching "' + searchPhrase + '". ' );
                    answer = readlineSync.question( 'Please enter another search term or enter to cancel ' );
                    if( answer.length <= 0 ){
                        updateTeam.finish( identifier );
                    } else {
                        updateTeam.searchHltv( answer, identifier );
                    }
                } else {
                    for( i = 0; i < teams.length; i = i + 1 ){
                        console.log( parseInt( i + 1, 10 ) + ': ' + teams[ i ].name + ' (' + teams[ i ].country + ')' );
                    }

                    answer = readlineSync.question( 'Select the correct team, if none match, enter 0. To cancel, press Enter ' );
                    if( answer.length <= 0 ){
                        updateTeam.finish( identifier );
                    } else if( answer === '0' ){
                        answer = readlineSync.question( 'Please enter a search term ' );
                        updateTeam.searchHltv( answer, identifier );
                    } else {
                        i = parseInt( answer, 10 ) - 1;

                        updateTeam.teamsList[ identifier ].hltv = {
                            name : teams[ i ].name,
                            id : teams[ i ].id
                        };

                        updateTeam.finish( identifier );
                    }
                }
            } );
        },
        searchGosugamers : function( searchPhrase, identifier ){
            'use strict';
            gosugamers.search( searchPhrase, function( teams ){
                var i,
                    answer;

                if( teams.length <= 0 ){
                    console.log( 'Could not find any teams matching "' + searchPhrase + '". ' );
                    answer = readlineSync.question( 'Please enter another search term or enter to cancel ' );
                    if( answer.length <= 0 ){
                        updateTeam.finish( identifier );
                    } else {
                        updateTeam.searchGosugamers( answer, identifier );
                    }
                } else {
                    for( i = 0; i < teams.length; i = i + 1 ){
                        console.log( parseInt( i + 1, 10 ) + ': ' + teams[ i ].name );
                    }

                    answer = readlineSync.question( 'Select the correct team, if none match, enter 0. To cancel, press Enter ' );
                    if( answer.length <= 0 ){
                        updateTeam.finish( identifier );
                    } else if( answer === '0' ){
                        answer = readlineSync.question( 'Please enter a search term ' );
                        updateTeam.searchGosugamers( answer, identifier );
                    } else {
                        i = parseInt( answer, 10 ) - 1;

                        updateTeam.teamsList[ identifier ].gosugamers = teams[ i ];

                        updateTeam.finish( identifier );
                    }
                }
            } );
        },
        writeTeamList : function( identifier ){
            fs.writeFile( 'teams/all.json', JSON.stringify( updateTeam.teamsList, null, 4 ), function( error ){
                if( error ){
                    console.log( error );
                }
            });
        },
        writeData : function( identifier ){
            fs.writeFile( 'teams/' + updateTeam.teamsList[ identifier ].name + '/data.json', JSON.stringify( updateTeam.teamsList[ identifier ], null, 4 ), function( error ){
                if( error ){
                    console.log( error );
                } else {
                    console.log( 'Team data written successfully' );
                    updateTeam.writeTeamList();
                    updateTeam.chooseDataType();
                }
            });
        },
        finish: function( identifier ){
            var answer;
            console.log( JSON.stringify( updateTeam.teamsList[ identifier ], null, 4 ) );
            answer = readlineSync.question( 'Is this correct? (Y/N) ' );
            answer = answer.trim();
            switch( answer ){
                case 'n':
                case 'N':
                    updateTeam.chooseDataType();
                    break;
                case 'y':
                case 'Y':
                    updateTeam.writeData( identifier );
                    break;
            }
        },
        csGoLoungeName: function(){
            var answer;
            answer = readlineSync.question( 'What is the name of the team on CSGOLounge? ' );
            if( answer.length > 0 ){
                updateTeam.teamData.csgolounge = {
                    'name': answer
                };
            }

            updateTeam.finish();
        },
        chooseDataType : function(){
            var answer;
            console.log( '1: HLTV' );
            console.log( '2: CSGOLounge' );
            console.log( '3: GosuGamers' );

            answer = readlineSync.question( 'Select what to update: ' );
            switch( answer ){
                case '1':
                    updateTeam.findMissingData( 'hltv' );
                    break;
                case '2':
                    updateTeam.findMissingData( 'csgolounge' );
                    break;
                case '3':
                    updateTeam.findMissingData( 'gosugamers' );
                    break;
            }
        },
        findMissingData : function( type ){
            var i = 1,
                answer;

            updateTeam.currentList = [];

            for( identifier in updateTeam.teamsList ){
                if( updateTeam.teamsList.hasOwnProperty( identifier ) ){
                    if( typeof updateTeam.teamsList[ identifier ][ type ] === 'undefined' ){
                        console.log( i + ': ' + updateTeam.teamsList[ identifier ].name );
                        updateTeam.currentList[ i ] = identifier;
                        i = i + 1;
                    }
                }
            }

            answer = readlineSync.question( 'Select what team to update: ' );
            i = parseInt( answer, 10 );
            switch( type ){
                case 'hltv':
                    updateTeam.searchHltv( updateTeam.teamsList[ updateTeam.currentList[ i ] ].name, updateTeam.currentList[ i ] );
                    break;
                case 'gosugamers':
                    updateTeam.searchGosugamers( updateTeam.teamsList[ updateTeam.currentList[ i ] ].name, updateTeam.currentList[ i ] );
                    break;
            }
        },
        loadTeams : function(){
            jsonfile.readFile( 'teams/all.json', function( error, teamData ){
                if( error ){
                    throw error;
                } else {
                    updateTeam.teamsList = teamData;
                    updateTeam.chooseDataType();
                }
            });
        },
        start : function(){
            'use strict';

            updateTeam.loadTeams();
        }
    };

updateTeam.start();
