<?php
class AvailableTeams {
    private $teamListFilename = 'resources/teamlist.json';
    private $list;
    private $parsedList = array();
    private $unknownTeamIdentifier = '-unknown-';

    private $alternateTeamNames = array();

    public function __construct( $teamListFilenamePrefix = '' ){
        $this->teamListFilenamePrefix = $teamListFilenamePrefix;
        $this->loadFromFile();
    }

    private function parseTeamList( $teamListData ){
        $list = array();
        foreach( $teamListData as $identifier => $teamData ) :
            $list[ $identifier ] = $teamData[ 'name' ];

            // Add all csgolounge names to the list of available teams
            if( isset( $teamData[ 'csgolounge' ] ) ) :
                if( !isset( $this->alternateTeamNames[ $this->normalizeString( $teamData[ 'csgolounge' ][ 'name' ] ) ] ) ) :
                    $this->alternateTeamNames[ $this->normalizeString( $teamData[ 'csgolounge' ][ 'name' ] ) ] = $identifier;
                endif;
            endif;

            // Add all gosugamers names to the list of available teams
            if( isset( $teamData[ 'gosugamers' ] ) ) :
                if( !isset( $this->alternateTeamNames[ $this->normalizeString( $teamData[ 'gosugamers' ][ 'name' ] ) ] ) ) :
                    $this->alternateTeamNames[ $this->normalizeString( $teamData[ 'gosugamers' ][ 'name' ] ) ] = $identifier;
                endif;
            endif;

            // Add all hltv names to the list of available teams
            if( isset( $teamData[ 'hltv' ] ) ) :
                if( !isset( $this->alternateTeamNames[ $this->normalizeString( $teamData[ 'hltv' ][ 'name' ] ) ] ) ) :
                    $this->alternateTeamNames[ $this->normalizeString( $teamData[ 'hltv' ][ 'name' ] ) ] = $identifier;
                endif;
            endif;

            // Add all teams without the "team" prefix to the list of available teams
            if( stripos( $identifier, 'team' ) !== false ) :
                $this->alternateTeamNames[ str_ireplace( 'team', '', $identifier ) ] = $identifier;
            endif;

            // Special cases for team names with dots in them
            if( stripos( $teamData[ 'name' ], '.' ) !== false ) :
                // Add all teams with dot's replaced with space to the list of available teams
                $this->alternateTeamNames[ $this->normalizeString( str_ireplace( '.', ' ', $teamData[ 'name' ] ) ) ] = $identifier;

                // Add first part of team names with dots in them to the list of available teams
                $nameParts = explode( '.', $teamData[ 'name' ] );
                $this->alternateTeamNames[ $this->normalizeString( $nameParts[ 0 ] ) ] = $identifier;
            endif;
        endforeach;

        return $list;
    }

    private function loadFromFile(){
        $kurl = new Kurl();
        $data = json_decode( $kurl->loadData( $this->teamListFilenamePrefix . $this->teamListFilename ), true );
        $this->list = $this->parseTeamList( $data );
        $this->list[ $this->unknownTeamIdentifier ] = '???';
        $this->setParsedList();
    }

    private function setParsedList(){
        foreach( $this->list as $identifier => $name ):
            $this->parsedList[ $identifier ] = str_ireplace( 'team', '', $name );
        endforeach;
    }

    private function filterTeams( $teams, $closestToWhat ){
        if( !isset( $teams[ 0 ] ) ) :
            return array(
                'identifier' => $this->unknownTeamIdentifier,
                'position' => false
            );
        endif;

        $closestTeam = $teams[ 0 ];

        foreach( $teams as $team ) :
            if( $closestToWhat == 'end' ) :
                if( $team[ 'position' ] > $closestTeam[ 'position' ] ) :
                    $closestTeam = $team;
                elseif( $team[ 'position' ] == $closestTeam[ 'position' ] ) :
                    if( $team[ 'priority' ] > $closestTeam[ 'priority' ] ):
                        $closestTeam = $team;
                    endif;
                endif;
            else:
                if( $team[ 'position' ] <  $closestTeam[ 'position' ] ) :
                    $closestTeam = $team;
                elseif( $team[ 'position' ] == $closestTeam[ 'position' ] ) :
                    if( $team[ 'priority' ] > $closestTeam[ 'priority' ] ):
                        $closestTeam = $team;
                    endif;
                endif;
            endif;
        endforeach;

        return $closestTeam;
    }

    public function getTeamsInString( $string ){
        $stringParts = explode( 'vs', $this->normalizeString( $string ) );
        $teams = array();

        // In the first part we want to find the team closes to the end of the string
        $teams[] = $this->findTeam( $stringParts[ 0 ], 'end');

        // In the second part we want to find the team closes to the beginning of the string
        $teams[] = $this->findTeam( $stringParts[ 1 ], 'beginning' );

        // Make sure we don't return an array with identical identified teams
        if( $teams[ 0 ][ 'identifier' ] == $teams[ 1 ][ 'identifier' ] ) :
            $teams[ 1 ][ 'identifier' ] = $this->unknownTeamIdentifier;
        endif;

        return $teams;
    }

    private function findTeam( $string, $closestToWhat ){
        $teams = $this->alternateTeamsInString( $string );

        foreach( $this->list as $identifier => $name ):

            // Check if the name is in the string
            $position = stripos( $string, $name );
            if( $position !== false ):
                $teams[] = array(
                    'identifier' => $identifier,
                    'position' => $position,
                    'priority' => 1
                );
                continue;
            endif;

            // Check if the identifier is in the string
            $position = stripos( $string, $identifier );
            if( $position !== false ):
                $teams[] = array(
                    'identifier' => $identifier,
                    'position' => $position,
                    'priority' => 1
                );
                continue;
            endif;

            // Check if the parsed name is in the string
            $position = stripos( $string, $this->parsedList[ $identifier ] );
            if( $position !== false ):
                $teams[] = array(
                    'identifier' => $identifier,
                    'position' => $position,
                    'priority' => 1
                );
                continue;
            endif;

        endforeach;

        $team = $this->filterTeams( $teams, $closestToWhat );

        return $team;
    }

    public function getNameFromIdentifier( $identifier ){
        return $this->list[ $identifier ];
    }

    private function stripSpecialChars( $string ){
        $string = preg_replace( '#[\(\)\[\]]#', ' ', $string );
        return preg_replace( '#[^a-zA-Z0-9\- \.]#', '', $string );
    }

    private function normalizeString( $string ){
        $string = strtolower( $string );
        return $this->stripSpecialChars( $string );
    }

    private function alternateTeamsInString( $string ){
        $teamsInString = array();

        $normalizedString = preg_replace( '#[\.\-]#', ' ', $string );
        $normalizedString = $this->stripSpecialChars( $normalizedString );

        $normalizedString = ' ' . $normalizedString . ' ';

        foreach( $this->alternateTeamNames as $checkString => $identifier ) :
            $position = stripos( $normalizedString, ' ' . $this->stripSpecialChars( $checkString ) . ' ' );

            if( $position !== false ) :
                $teamsInString[] = array(
                    'identifier' => $identifier,
                    'position' => $position,
                    'priority' => 0
                );
            endif;
        endforeach;

        return $teamsInString;
    }
}
