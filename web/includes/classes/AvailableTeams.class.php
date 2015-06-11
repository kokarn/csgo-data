<?php
class AvailableTeams {
    private $teamListFilename = 'resources/teamlist.json';
    private $list;
    private $unknownTeamIdentifier = '-unknown-';
    private $blacklisteadTeamNameParts = array(
        'esports',
        'esport',
        'gaming',
        'team',
        'in',
        'the',
        'playing'
    );

    private $alternateTeamNames = array();
    private $skipTeams = array(
        array(),
        array()
    );

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

                // Add all teams with dot's removed to the list of available teams
                $this->alternateTeamNames[ $this->normalizeString( str_ireplace( '.', '', $teamData[ 'name' ] ) ) ] = $identifier;

                // Add first part of team names with dots in them to the list of available teams
                $nameParts = explode( '.', $teamData[ 'name' ] );
                $this->alternateTeamNames[ $this->normalizeString( $nameParts[ 0 ] ) ] = $identifier;
            endif;

            // Add all parts except for some blacklisted ones for team names with spaces in them
            if( stripos( $teamData[ 'name' ], ' ' ) !== false ) :
                $teamParts = explode( ' ', $this->normalizeString( $teamData[ 'name' ] ) );
                $teamParts = array_filter( $teamParts, array( $this, 'isNotBlacklisteadTeamPart' ) );

                foreach( $teamParts as $teamIdentifier ) :

                    // Special case for team name parts ending in "3", eg "flipsid3"
                    if( substr( $teamIdentifier, -1 ) == '3' ) :
                        $this->alternateTeamNames[ substr( $teamIdentifier, 0, strlen( $teamIdentifier ) - 1 ) . 'e' ] = $identifier;
                    endif;

                    $this->alternateTeamNames[ $teamIdentifier ] = $identifier;
                endforeach;
            endif;
        endforeach;

        return $list;
    }

    private function loadFromFile(){
        $kurl = new Kurl();
        $data = json_decode( $kurl->loadData( $this->teamListFilenamePrefix . $this->teamListFilename ), true );
        $this->list = $this->parseTeamList( $data );
        $this->list[ $this->unknownTeamIdentifier ] = '???';
    }

    private function isNotBlacklisteadTeamPart( $string ){
        if( in_array( $string, $this->blacklisteadTeamNameParts ) ):
            return false;
        endif;

        return true;
    }

    private function filterTeams( $teams, $closestToWhat ){
        $teams = array_values( $teams );

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

    private function guessStrings( $strings ){
        $guessedStrings = array();

        foreach( $strings as $stringPart ) :
            $parsedString = trim( preg_replace( '#\.#', '', $stringPart ) );

            if( strlen( $parsedString ) > 0 ) :
                $guessedStrings[] = $stringPart;
            endif;
        endforeach;

        return $guessedStrings;
    }

    private function splitString( $string ){
        $this->stringParts = explode( 'vs', $this->normalizeString( $string ) );

        if( count( $this->stringParts ) > 2 ) :
            $this->stringParts = $this->guessStrings( $this->stringParts );
        endif;
    }

    private function cleanClass(){
        $this->skipTeams = array(
            array(),
            array()
        );

        $this->stringParts = false;
    }

    public function getTeamsInString( $string ){
        $this->cleanClass();
        $this->splitString( $string );

        $teams = array();

        // Find the first team
        $teams[] = $this->findTeam( 0 );

        // Find the second team
        $teams[] = $this->findTeam( 1 );

        return $this->validateTeams( $teams );
    }

    private function validateTeams( $teams ){
        // Make sure we don't return an array with identical identified teams
        if( $teams[ 0 ][ 'identifier' ] == $teams[ 1 ][ 'identifier' ] ) :
            if( !isset( $teams[ 0 ][ 'priority' ] ) || !isset( $teams[ 1 ][ 'priority' ] ) ) :
                $teams[ 1 ][ 'identifier' ] = $this->unknownTeamIdentifier;
            elseif( $teams[ 0 ][ 'priority' ] > $teams[ 1 ][ 'priority' ] ) :
                $this->skipTeams[ 1 ][] = $teams[ 1 ][ 'identifier' ];
                $alternateTeam = $this->findTeam( 1 );

                if( isset( $alternateTeam[ 'identifier' ] ) ) :
                    $teams[ 1 ] = $alternateTeam;
                else :
                    $teams[ 1 ][ 'identifier' ] = $this->unknownTeamIdentifier;
                endif;
            else :
                $this->skipTeams[ 0 ][] = $teams[ 0 ][ 'identifier' ];
                $alternateTeam = $this->findTeam( 0 );

                if( isset( $alternateTeam[ 'identifier' ] ) ) :
                    $teams[ 0 ] = $alternateTeam;
                else :
                    $teams[ 0 ][ 'identifier' ] = $this->unknownTeamIdentifier;
                endif;
            endif;
        endif;

        return $teams;
    }

    private function findTeam( $stringPartIndex ){
        $teams = $this->alternateTeamsInString( $this->stringParts[ $stringPartIndex ] );

        if( $stringPartIndex == 0 ) :
            // In the first part we want to find the team closes to the end of the string
            $closestToWhat = 'end';
        else :
            // In the second part we want to find the team closes to the beginning of the string
            $closestToWhat = 'beginning';
        endif;

        $teams = array_merge( $teams, $this->teamInString( $this->stringParts[ $stringPartIndex ] ) );

        if( !empty( $this->skipTeams[ $stringPartIndex ] ) ) :

            // Loop over all the skip teams
            foreach( $this->skipTeams[ $stringPartIndex ] as $skipTeam ) :

                // Loop over all found teams and remove the ones we should skip
                foreach( $teams as $key => $team ) :
                    if( $team[ 'identifier' ] == $skipTeam ) :
                        unset( $teams[ $key ] );
                    endif;
                endforeach;
            endforeach;
        endif;

        $team = $this->filterTeams( $teams, $closestToWhat );

        return $team;
    }

    private function teamInString( $string ){
        $teams = array();

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
        endforeach;

        return $teams;
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

        if( empty( $teamsInString ) ):
            $normalizedString = preg_replace( '#[\.\-]#', '', $string );
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
        endif;

        return $teamsInString;
    }
}
