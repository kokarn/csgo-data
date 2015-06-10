<?php
class HitboxApi {
    private static $baseUrl = 'https://www.hitbox.tv/api/';

    public function getStreamsByGame( $game ){
        $channelList = array();

        // This is a temporary solution until Hitbox enables filter by game
        $channels = $this->loadUrl( self::$baseUrl . 'media/live/list?liveonly=yes&showHidden=no&publicOnly=yes' );
        foreach( $channels->livestream as $channel ) :
            if( $channel->category_name !== $game ) :
                continue;
            endif;
            $channelList[] = $this->streamFromData( $channel );
        endforeach;

        return $channelList;
    }

    private function streamFromData( $data ){
        $stream = new Stream();
        
        // set quality
        $quality = json_decode( $data->media_profiles );
        if( $quality !== null ) :
            $quality = end( $quality );
            $stream->setQuality( $quality->height );
        endif;

        $stream->setViewers( $data->media_views );
        $stream->setPreviewImage( 'http://hitbox.tv' . $data->media_thumbnail_large );
        $stream->setStatus( $data->media_status );
        $stream->setName( $data->media_name );
        $stream->setLink( $data->channel->channel_link );

        return $stream;
    }

    private function loadUrl( $url ){
        $kurl = new Kurl();
        return json_decode( $kurl->loadData( $url ) );
    }
}
