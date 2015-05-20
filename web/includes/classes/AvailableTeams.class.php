<?php
class AvailableTeams {
    private static $teamListFilename = 'resources/teamlist.json';
    private $list;
    private $parsedList = array();
    private $unknownTeamIdentifier = '-unknown-';

    private $alternateTeamNames = array(
        'hr' => 'hellraisers',
        'm5' => 'moscowfive',
        'nip' => 'ninjasinpyjamas',
        'navi' => 'natusvincere',
        'tsm' => 'teamsolomid',
        'penta' => 'pentasports'
    );

    public function __construct(){
        $this->loadFromFile();
    }

    private function parseTeamList( $teamListData ){
        $list = array();
        foreach( $teamListData as $identifier => $teamData ) :
            $list[ $identifier ] = $teamData[ 'name' ];

            // Add all teams without the "team" prefix to the list of available teams
            if( stripos( $identifier, 'team' ) !== 'false' ) :
                $this->alternateTeamNames[ str_ireplace( 'team', '', $identifier ) ] = $identifier;
            endif;
        endforeach;
        return $list;
    }

    private function loadFromFile(){
        $kurl = new Kurl();
        $data = json_decode( $kurl->loadData( self::$teamListFilename ), true );
        $this->list = $this->parseTeamList( $data );
        $this->list[ $this->unknownTeamIdentifier ] = '???';
        $this->setParsedList();
    }

    private function setParsedList(){
        foreach( $this->list as $identifier => $name ):
            $this->parsedList[ $identifier ] = str_ireplace( 'team', '', $name );
        endforeach;
    }

    private function filterTeams( $teams ){
        //echo "pre\n\r";
        //print_r( $teams );
        $estimatedTeams = array_slice( $teams, 0, 2 );
        if( isset( $estimatedTeams[ 1 ] ) ) :
            if( $estimatedTeams[ 0 ][ 'identifier' ] == $estimatedTeams[ 1 ][ 'identifier' ] ) :
                $estimatedTeams[ 1 ] = array(
                    'identifier' => $this->unknownTeamIdentifier,
                    'position' => 1000
                );
            endif;
        endif;

        foreach( $teams as $team ) :
            if( $estimatedTeams[ 0 ][ 'identifier' ] == $team[ 'identifier' ] ):
                if( $estimatedTeams[ 0 ][ 'position' ] > $team[ 'position' ] ) :
                    $estimatedTeams[ 0 ] = $team;
                endif;

                continue;
            endif;

            if( $estimatedTeams[ 1 ][ 'identifier' ] == $team[ 'identifier' ] ):
                if( $estimatedTeams[ 1 ][ 'position' ] > $team[ 'position' ] ) :
                    $estimatedTeams[ 1 ] = $team;
                endif;

                continue;
            endif;

            if( $estimatedTeams[ 1 ][ 'position' ] > $team[ 'position' ] ):
                $estimatedTeams[ 1 ] = $team;
                continue;
            endif;

            if( $estimatedTeams[ 0 ][ 'position' ] > $team[ 'position' ] ):
                $estimatedTeams[ 0 ] = $team;
                continue;
            endif;
        endforeach;

        if( count( $estimatedTeams ) < 2 ) :
            $estimatedTeams[] = array(
                'identifier' => $this->unknownTeamIdentifier,
                'name' => '???'
            );
        endif;
        //echo "post\n\r";
        //print_r( $estimatedTeams );

        return $estimatedTeams;
    }

    public function getTeamsInString( $string ){
        $teams = $this->alternateTeamsInString( $string );

        foreach( $this->list as $identifier => $name ):

            // Check if the name is in the string
            $position = stripos( $string, $name );
            if( $position !== false ):
                $teams[] = array(
                    'identifier' => $identifier,
                    'position' => $position
                );
                continue;
            endif;

            // Check if the identifier is in the string
            $position = stripos( $string, $identifier );
            if( $position !== false ):
                $teams[] = array(
                    'identifier' => $identifier,
                    'position' => $position
                );
                continue;
            endif;

            // Check if the parsed name is in the string
            $position = stripos( $string, $this->parsedList[ $identifier ] );
            if( $position !== false ):
                $teams[] = array(
                    'identifier' => $identifier,
                    'position' => $position
                );
                continue;
            endif;

        endforeach;

        $teams = $this->filterTeams( $teams );

        return $teams;
    }

    public function getNameFromIdentifier( $identifier ){
        return $this->list[ $identifier ];
    }

    private function alternateTeamsInString( $string ){
        $teamsInString = array();

        $normalizedString = preg_replace( '#[^a-zA-Z0-9\- \.]#', '', $string );

        foreach( $this->alternateTeamNames as $checkString => $identifier ) :
            $position = stripos( $normalizedString, $checkString );
            if( $position !== false ) :
                $teamsInString[] = array(
                    'identifier' => $identifier,
                    'position' => $position
                );
            endif;
        endforeach;

        return $teamsInString;
    }
}
