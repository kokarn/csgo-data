<?php

function __autoload( $className ){
    include 'classes/' . $className . '.class.php';
}

function outputJson( $data ){
    header( 'Content-type: application/json' );
    $jsonData = json_encode( $data );

    if( $jsonData == null ) :
        $jsonData = '{"message": "Could not encode data to JSON. Please contact an administrator."}';
    endif;

    die( $jsonData );
}
