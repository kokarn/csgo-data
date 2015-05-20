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
        'envyus' => 'teamenvyus',
        'penta' => 'pentasports'
    );

    public function __construct(){
        $this->loadFromFile();
    }

    private function parseTeamList( $teamListData ){
        $list = array();
        foreach( $teamListData as $identifier => $teamData ) :
            $list[ $identifier ] = $teamData[ 'name' ];
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
        if( count( $teams ) == 2 ) :
            return $teams;
        endif;

        $estimatedTeams = array_slice( $teams, 0, 2 );
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

            if( $estimatedTeams[ 0 ][ 'position' ] > $team[ 'position' ] ):
                $estimatedTeams[ 0 ] = $team;
                continue;
            endif;

            if( $estimatedTeams[ 1 ][ 'position' ] > $team[ 'position' ] ):
                $estimatedTeams[ 1 ] = $team;
                continue;
            endif;
        endforeach;

        if( count( $estimatedTeams ) < 2 ) :
            $estimatedTeams[] = array(
                'identifier' => $this->unknownTeamIdentifier,
                'name' => '???'
            );
        endif;

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
