<?php
    class Kurl {
        private $data = false;
        private $defaultCacheTime = 60;

        public function loadData( $url ){
            $this->loadFromCache( $url );

            return $this->data;
        }

        private function loadFromCache( $key ){
            $this->data = apc_fetch( $key );

            if( $this->data == false ) :
                $this->loadFromWeb( $key );
            endif;
        }

        private function loadFromWeb( $url ){
            $this->data = file_get_contents( $url );

            apc_store( $url, $this->data, $this->defaultCacheTime );
        }
    }
