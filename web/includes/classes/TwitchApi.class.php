<?php
class TwitchApi {
    private static $baseUrl = 'https://api.twitch.tv/kraken/';

    public function getStreamsByGame( $game ){
        $channelList = array();

        $channels = $this->loadUrl( self::$baseUrl . 'streams?limit=100&game=' . urlencode( $game ) );
        foreach( $channels->streams as $channel ) :
            $channelList[] = $this->streamFromData( $channel );
        endforeach;

        return $channelList;
    }

    private function streamFromData( $data ){
        $stream = new Stream();

        $stream->setViewers( $data->viewers );
        $stream->setQuality( $data->video_height );
        $stream->setAverageFps( $data->average_fps );

        $stream->setPreviewImage( $data->preview->large );
        //$this->previewImageTemplate = $object->preview->template;

        if( isset( $data->channel->broadcaster_language ) ):
            $stream->setBroadcasterLanguage( $data->channel->broadcaster_language );
            $stream->setLanguage( $data->channel->language );
            $stream->setStatus( $data->channel->status );
            $stream->setName( $data->channel->display_name );
            $stream->setLink( 'http://www.twitch.tv/' . $data->channel->display_name );
        endif;

        return $stream;
    }

    private function loadUrl( $url ){
        $kurl = new Kurl();
        return json_decode( $kurl->loadData( $url ) );
    }
}
