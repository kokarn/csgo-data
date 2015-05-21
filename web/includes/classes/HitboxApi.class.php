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
            $channelList[] = new Stream( $channel );
        endforeach;

        return $channelList;
    }

    private function loadUrl( $url ){
        $kurl = new Kurl();
        return json_decode( $kurl->loadData( $url ) );
    }
}
