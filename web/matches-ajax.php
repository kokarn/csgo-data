<?php
include( 'includes/default.php' );

if( $_GET[ 'site' ] == 'hitbox' ) :
    $apiWrapper = new HitboxApi();
elseif( $_GET[ 'site' ] == 'azubu' ) :
    $apiWrapper = new AzubuApi();
else :
    $apiWrapper = new TwitchApi();
endif;

$streams = $apiWrapper->getStreamsByGame( 'Counter-Strike: Global Offensive' );

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
