<?php
class MLGApi {
    private static $allChannelsLiveStatus = 'http://streamapi.majorleaguegaming.com/service/streams/all';
    private static $allChannelsUrl = 'http://www.majorleaguegaming.com/api/channels/all.js?fields=id,name,slug,subtitle,game_id,stream_name,type,is_hidden,image_1_1,image_16_9,image_16_9_small,image_16_9_medium,image_background,url,embed_code,stream_featured,stream_sort_order,tags,tag_names,description';
    private static $allGamesUrl = 'http://www.majorleaguegaming.com/api/games/all.js';

    public function getStreamsByGame( $game ){
        $channelList = array();
        $streamList = array();

        // This is a temporary solution until Hitbox enables filter by game
        $result = $this->loadUrl( self::$allChannelsUrl );

        $liveStatus = $this->loadUrl( self::$allChannelsLiveStatus );

        foreach( $result->data->items as $channel ) :
            if( $channel->game_id !== $this->getGameId( $game ) ) :
                continue;
            endif;

            $channelList[ $channel->id ] = $channel;
        endforeach;

        foreach( $liveStatus->data->items as $channelLiveStatus ) :
            if( $channelLiveStatus->status !== 1 ) :
                continue;
            endif;

            // Check if the live stream is in the list of streams with the requested game listed
            if( !isset( $channelList[ $channelLiveStatus->channel_id ] ) ) :
                continue;
            endif;

            if( isset( $channelLiveStatus->viewers ) ) :
                $channelList[ $channelLiveStatus->channel_id ]->viewers = $channelLiveStatus->viewers;
            endif;

            $streamList[] = $this->streamFromData( $channelList[ $channelLiveStatus->channel_id ] );
        endforeach;

        return $streamList;
    }

    private function getGameId( $game ){
        switch( $game ) :
            case 'Counter-Strike: Global Offensive':
                return 13;
            default:
                return false;
        endswitch;
    }

    private function streamFromData( $data ){
        $stream = new Stream();

        if( isset( $data->viewers ) ) :
            $stream->setViewers( $data->viewers );
        endif;
        
        $stream->setPreviewImage( $data->image_16_9 );
        $stream->setStatus( $data->subtitle );
        $stream->setName( $data->name );
        $stream->setLink( $data->url );

        return $stream;
    }

    private function loadUrl( $url ){
        $kurl = new Kurl();
        return json_decode( $kurl->loadData( $url ) );
    }
}
