<?php
if( !isset( $_GET[ 'team' ] ) || !isset( $_GET[ 'size' ] ) ):
    exit();
endif;

include( '../includes/default.php' );

function outputPngIfExists( $filePath ){
    if( file_exists( $filePath ) ):
        header( 'Content-type: image/png' );
        readfile( $filePath );
        exit;
    endif;
}

$team = strtolower( $_GET[ 'team' ] );
$size = 0 + $_GET[ 'size' ];
$teams = array();

if( $size > 2000 ):
    $size = 2000;
endif;

if( $size <= 0 ):
    exit;
endif;

$logoPath = './' . $team . '-' . $size . 'x' . $size . '.png';

outputPngIfExists( $logoPath );

$data = (array)json_decode( file_get_contents( '../resources/teamlist.json' ) );

foreach( $data as $teamIdentifier => $teamData ):
    $teams[ $teamIdentifier ] = $teamData;
    $teams[ strtolower( $teamData->name ) ] = $teamData;
endforeach;

if( !isset( $teams[ $team ] ) ):
    header( 'HTTP/1.0 404 Not Found' );
    echo '<h1>404 Not Found</h1>';
    echo 'The page that you have requested could not be found.';
    exit();
endif;

$logoPath = './' . $teams[ $team ]->identifier . '-' . $size . 'x' . $size . '.png';

outputPngIfExists( $logoPath );

$dir = opendir( '../../teams/' . $teams[ $team ]->name );
while ( false !== ( $entry = readdir( $dir ) ) ) :
    if( strpos( $entry, 'logo-' ) !== false ):
        break;
    endif;
endwhile;

closedir( $dir );

$file = '../../teams/' . $teams[ $team ]->name . '/' . $entry;

smart_resize_image( null, file_get_contents( $file ), $size, $size, false, $logoPath, false, false, 0 );
header( 'X-Generated: 1' );
outputPngIfExists( $logoPath );
