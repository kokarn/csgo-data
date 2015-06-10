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

    public function isCast( $string = false ){
        if( $string ) :
            $checkString = $string;
        else :
            $checkString = $this->status;
        endif;

        return preg_match( '#vs#', $checkString );
    }

    public function setAverageFps( $averageFps ){
        if( round( $averageFps ) % 5 === 0 ) :
            $this->averageFps = round( $averageFps );
        else:
            $this->averageFps = round( ( $averageFps + 5 / 2 ) / 5 ) * 5;
        endif;
    }

    public function setName( $name ){
        $this->name = $name;
    }

    public function setStatus( $status ){
        $this->status = $status;

        $this->isCast = $this->isCast();
    }

    public function setQuality( $quality ){
        $this->quality = $quality;
    }

    public function setViewers( $viewers ){
        $this->viewers = $viewers;
    }

    public function setPreviewImage( $previewImage ){
        $this->previewImage = $previewImage;
    }

    public function setLink( $link ){
        $this->link = $link;
    }

    public function setBroadcasterLanguage( $broadcasterLanguage ){
        $this->broadcasterLanguage = $broadcasterLanguage;
    }

    public function setLanguage( $language ){
        $this->language = $language;
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
