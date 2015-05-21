<?php
include( 'includes/default.php' );

if( $_GET[ 'site' ] == 'hitbox' ) :
    $hitboxApi = new HitboxApi();
    $streams = $hitboxApi->getStreamsByGame( 'Counter-Strike: Global Offensive' );
else :
    $twitchApi = new TwitchApi();
    $streams = $twitchApi->getStreamsByGame( 'Counter-Strike: Global Offensive' );
endif;

$teamList = new AvailableTeams();

$matches = array();

foreach( $streams as $stream ):
    if( !$stream->getIsCast() ) :
        continue;
    endif;

    $streamTeamList = array();

    $teams = $teamList->getTeamsInString( $stream->getStatus() );
    sort( $teams );

    foreach( $teams as $team ) :
        $streamTeamList[] = array(
            'identifier' => $team[ 'identifier' ],
            'name' => $teamList->getNameFromIdentifier( $team[ 'identifier' ] )
        );
    endforeach;

    $matchIdentifier = serialize( $streamTeamList );
    if( !isset( $matches[ $matchIdentifier ] ) ) :
        $matches[ $matchIdentifier ] = array(
            'teams' => $streamTeamList,
            'streams' => array()
        );
    endif;

    $matches[ $matchIdentifier ][ 'streams' ][] = $stream;
endforeach;

outputJson( array_values( $matches ) );
