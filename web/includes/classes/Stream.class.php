<?php
class Stream {
    public $name;
    public $viewers;
    public $averageFps;
    public $previewImage;
    public $quality;
    public $broadcasterLanguage;
    public $language;
    public $status;
    public $link;

    private $isCast = false;
    private $rawObjectData;
    private $previewImageTemplate;

    public function __construct( $object = false ){
        if( $object ):
            $this->dataFromObject( $object );
        endif;
    }

    private function dataFromObject( $object ){
        $this->rawObjectData = $object;

        if( isset( $object->viewers ) ) :
            $this->dataFromTwitchObject( $object );
        else :
            $this->dataFromHitboxObject( $object );
        endif;
    }

    private function dataFromHitboxObject( $object ){
        // set quality
        $quality = json_decode( $object->media_profiles );
        if( $quality !== null ) :
            $quality = end( $quality );
            $this->quality = $quality->height;
        endif;

        $this->viewers = $object->media_views;
        $this->previewImage = 'http://hitbox.tv' . $object->media_thumbnail_large;
        $this->status = $object->media_status;
        $this->name = $object->media_name;
        $this->link = $object->channel->channel_link;

        /*
        $this->setAverageFps( $object->average_fps );

        $this->broadcasterLanguage = $object->channel->broadcaster_language;
        $this->language = $object->channel->language;
        */

        $this->isCast = $this->setIsCast();
    }

    private function dataFromTwitchObject( $object ){
        $this->viewers = $object->viewers;
        $this->quality = $object->video_height;
        $this->setAverageFps( $object->average_fps );

        $this->previewImage = $object->preview->large;
        $this->previewImageTemplate = $object->preview->template;

        if( isset( $object->channel->broadcaster_language ) ):
            $this->broadcasterLanguage = $object->channel->broadcaster_language;
            $this->language = $object->channel->language;
            $this->status = $object->channel->status;
            $this->name = $object->channel->display_name;
            $this->link = 'http://www.twitch.tv/' . $this->name;

            $this->isCast = $this->setIsCast();
        endif;
    }

    private function setIsCast(){
        return preg_match( '#vs#', $this->status );
    }

    private function setAverageFps( $averageFps ){
        if( round( $averageFps ) % 5 === 0 ) :
            $this->averageFps = round( $averageFps );
        else:
            $this->averageFps = round( ( $averageFps + 5 / 2 ) / 5 ) * 5;
        endif;
    }

    public function getStatus(){
        return $this->status;
    }

    public function getIsCast(){
        return $this->isCast;
    }

    public function getViewers(){
        return $this->viewers;
    }

    public function getName(){
        return $this->name;
    }

    public function getQuality(){
        return $this->quality;
    }

    public function getFramesPerSecond(){
        if( round( $this->averageFps ) % 5 === 0 ) :
            return round( $this->averageFps );
        endif;

        return round( ( $this->averageFps + 5 / 2 ) / 5 ) * 5;
    }

    public function getAverageFps(){
        return $this->averageFps;
    }

    public function getBroadcasterLanguage(){
        return $this->broadcasterLanguage;
    }

    public function getPreviewImage(){
        return $this->previewImage;
    }
}
