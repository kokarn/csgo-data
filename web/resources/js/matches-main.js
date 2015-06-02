Handlebars.registerHelper( 'ifCond', function( v1, operator, v2, options ){
    switch( operator ){
        case '==':
            return ( v1 == v2 ) ? options.fn( this ) : options.inverse( this );
        case '===':
            return ( v1 === v2 ) ? options.fn( this ) : options.inverse( this );
        case '<':
            return ( v1 < v2 ) ? options.fn( this ) : options.inverse( this );
        case '<=':
            return ( v1 <= v2 ) ? options.fn( this ) : options.inverse( this );
        case '>':
            return ( v1 > v2 ) ? options.fn( this ) : options.inverse( this );
        case '>=':
            return ( v1 >= v2 ) ? options.fn( this ) : options.inverse( this );
        case '&&':
            return ( v1 && v2 ) ? options.fn( this ) : options.inverse( this );
        case '||':
            return ( v1 || v2 ) ? options.fn( this ) : options.inverse( this );
        default:
            return options.inverse( this );
    }
});

(function( $ ){
    'use strict';
    var matches = {
            data : false,
            template : false,
            $matchesList : $( '.js-matches' ),
            $progressBar : $( '.js-progress-bar' ),
            requestsSent : 0,
            requestsDone : 0,
            init : function(){
                this.loadTemplate();
                this.loadData( 'hitbox' );
                this.loadData( 'twitch' );
                this.loadData( 'azubu' );
            },
            loadTemplate : function(){
                var _this = this,
                    xhr = $.ajax({
                        url: 'resources/matchtemplate.handlebars'
                    });

                this.requestsSent = this.requestsSent + 1;

                xhr.done(function( response ){
                    _this.requestsDone = _this.requestsDone + 1;

                    if( _this.$progressBar.length > 0 ){
                        _this.$progressBar.css({
                            width: ( _this.requestsDone / _this.requestsSent * 100 ).toString() + '%'
                        });
                    }
                    _this.template = Handlebars.compile( response );
                });
            },
            loadData : function( service ){
                var _this = this,
                    xhr = $.ajax({
                        url: 'matches-ajax.php',
                        data: {
                            'site': service
                        }
                    });

                this.requestsSent = this.requestsSent + 1;

                xhr.done(function( response ){
                    _this.requestsDone = _this.requestsDone + 1;

                    if( _this.$progressBar.length > 0 ){
                        _this.$progressBar.css({
                            width: ( _this.requestsDone / _this.requestsSent * 100 ).toString() + '%'
                        });
                    }

                    if( _this.data === false ) {
                        _this.data = response;
                    } else {
                        _this.data = _this.data.concat( response );
                    }
                    _this.updateData();
                });
            },
            updateData : function(){
                if( this.data === false && this.template === false ){
                    setTimeout( function(){
                        matches.updateData();
                    }, 50 );

                    return false;
                }

                if( this.requestsSent == this.requestsDone ) {
                    this.$progressBar.remove();

                    if( this.data.length === 0 ){
                        this.$matchesList.html( '<h1>Sorry, no livestreamed matches at the moment</h1>' );
                    }
                }

                if( this.data.length > 0 ){
                    this.$matchesList.html( ' ' );
                    for( var i = 0; i < this.data.length; i = i + 1 ){
                        this.$matchesList.append( this.template( this.data[ i ] ) );
                    }

                    $( '[data-toggle="popover"]' ).popover();
                }
            }
        };

    window.matches = matches;

    $(function(){
        matches.init();
    });
})( $ );
