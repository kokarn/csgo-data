<?php
class TwitchApi {
    private static $baseUrl = 'https://api.twitch.tv/kraken/';

    public function getStreamsByGame( $game ){
        $channelList = array();

        $channels = $this->loadUrl( self::$baseUrl . 'streams?limit=100&game=' . urlencode( $game ) );
        foreach( $channels->streams as $channel ) :
            $channelList[] = new Stream( $channel );
        endforeach;

        return $channelList;
    }

    private function loadUrl( $url ){
        $kurl = new Kurl();
        return json_decode( $kurl->loadData( $url ) );
    }
}
