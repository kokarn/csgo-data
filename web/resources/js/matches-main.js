Handlebars.registerHelper('ifCond', function (v1, operator, v2, options) {

    switch (operator) {
        case '==':
            return (v1 == v2) ? options.fn(this) : options.inverse(this);
        case '===':
            return (v1 === v2) ? options.fn(this) : options.inverse(this);
        case '<':
            return (v1 < v2) ? options.fn(this) : options.inverse(this);
        case '<=':
            return (v1 <= v2) ? options.fn(this) : options.inverse(this);
        case '>':
            return (v1 > v2) ? options.fn(this) : options.inverse(this);
        case '>=':
            return (v1 >= v2) ? options.fn(this) : options.inverse(this);
        case '&&':
            return (v1 && v2) ? options.fn(this) : options.inverse(this);
        case '||':
            return (v1 || v2) ? options.fn(this) : options.inverse(this);
        default:
            return options.inverse(this);
    }
});

(function( $ ){
    'use strict';
    var matches = {
            data : false,
            template : false,
            $matchesList : $( '.js-matches' ),
            $progressBar : $( '.js-progress-bar' ),
            init : function(){
                this.loadTemplate();
                this.loadData();
            },
            loadTemplate : function(){
                var _this = this,
                    xhr = $.ajax({
                        url: 'resources/matchtemplate.handlebars'
                    });

                xhr.done(function( response ){
                    if( _this.$progressBar.length > 0 ){
                        _this.$progressBar.css({
                            width: '50%'
                        });
                    }
                    _this.template = Handlebars.compile( response );
                });
            },
            loadData : function(){
                var _this = this,
                    xhr = $.ajax({
                        url: 'matches-ajax.php'
                    });

                xhr.done(function( response ){
                    if( _this.$progressBar.length > 0 ){
                        _this.$progressBar.css({
                            width: '50%'
                        });
                    }
                    _this.data = response;
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

                this.$progressBar.remove();

                if( this.data.length === 0 ){
                    this.$matchesList.html( '<h1>Sorry, no livestreamed matches at the moment</h1>' );
                } else {
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
