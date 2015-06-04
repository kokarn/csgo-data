<?php
class AzubuApi {
    private static $baseUrl = 'http://api.azubu.tv/';

    public function getStreamsByGame( $game ){
        $channelList = array();

        // This is a temporary solution until Azubu adds the title field to streams when queried by game
        $channels = $this->loadUrl( self::$baseUrl . 'public/channel/live/list' );
        foreach( $channels->data as $channel ) :
            if( $channel->category->title !== $game ) :
                continue;
            endif;
            $channelList[] = $this->streamFromData( $channel );
        endforeach;

        return $channelList;
    }

    private function parseGameName( $gameName ){
        switch( $gameName ) :
            case 'Counter-Strike: Global Offensive':
                return 'csgo';
            default:
                return $gameName;
        endswitch;
    }

    private function streamFromData( $data ){
        $stream = new Stream();

        $stream->setViewers( $data->view_count );
        $stream->setPreviewImage( $data->url_thumbnail );

        $stream->setBroadcasterLanguage( $data->language );
        $stream->setLanguage( $data->language );

        $stream->setStatus( $data->title );
        $stream->setName( $data->user->username );
        $stream->setLink( $data->url_channel );

        /*
        $this->quality = $object->video_height;
        $this->setAverageFps( $object->average_fps );
        */

        return $stream;
    }

    private function loadUrl( $url ){
        $kurl = new Kurl();
        return json_decode( $kurl->loadData( $url ) );
    }
}
