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

// From https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/keys
if (!Object.keys) {
  Object.keys = (function() {
    'use strict';
    var hasOwnProperty = Object.prototype.hasOwnProperty,
        hasDontEnumBug = !({ toString: null }).propertyIsEnumerable('toString'),
        dontEnums = [
          'toString',
          'toLocaleString',
          'valueOf',
          'hasOwnProperty',
          'isPrototypeOf',
          'propertyIsEnumerable',
          'constructor'
        ],
        dontEnumsLength = dontEnums.length;

    return function(obj) {
      if (typeof obj !== 'object' && (typeof obj !== 'function' || obj === null)) {
        throw new TypeError('Object.keys called on non-object');
      }

      var result = [], prop, i;

      for (prop in obj) {
        if (hasOwnProperty.call(obj, prop)) {
          result.push(prop);
        }
      }

      if (hasDontEnumBug) {
        for (i = 0; i < dontEnumsLength; i++) {
          if (hasOwnProperty.call(obj, dontEnums[i])) {
            result.push(dontEnums[i]);
          }
        }
      }
      return result;
    };
  }());
}

(function( $ ){
    'use strict';
    var matches = {
            matches : {},
            templates : {},
            countries : {},
            $matchesList : $( '.js-matches' ),
            $progressBar : $( '.js-progress-bar' ),
            $noMatches : $( '.js-no-matches' ),
            requestsSent : 0,
            unknownTeamIdentifier : '-unknown-',
            requestsDone : 0,
            init : function(){
                var _this = this;

                this.loadTemplates();
                this.loadStreams();
                this.loadCountries();

                setInterval( function(){
                    _this.loadStreams();
                }, 60000 );

                $( 'body' ).on( 'click touchstart', '.js-close', function( event ){
                    event.preventDefault();
                    event.stopImmediatePropagation();
                    $( this ).parents( '.js-match-wrapper' ).removeClass( 'active' );
                });

                $( 'body' ).on( 'click touchstart', '.js-match-wrapper', function(){
                    var $element = $( this ),
                        windowHeight = $( window ).height(),
                        elementHeight,
                        offset = 0;

                    $( '.active' ).removeClass( 'active' );
                    $element.addClass( 'active' );

                    elementHeight = $element.height();

                    if( windowHeight > elementHeight ){
                        offset = -( ( windowHeight - elementHeight ) / 2 )
                    }

                    $element
                        .velocity( 'stop' )
                        .velocity({
                            scale: '1'
                        }, 300 )
                        .velocity( 'scroll', {
                            offset : offset,
                            queue : false
                        });
                });

                $( 'body' ).on( 'mouseenter', '.js-match-wrapper', function(){
                    var $element = $( this );

                    if( !$element.hasClass( 'active' ) ){
                        $( this ).velocity( 'stop' ).velocity({
                            scale: '1.1'
                        }, 300 );
                    }
                });

                $( 'body' ).on( 'mouseleave', '.js-match-wrapper', function(){
                    $( this ).velocity({
                        scale: '1'
                    }, 300 );
                });

                $( 'body' ).on( 'mouseenter', '.js-match-wrapper .js-stream-row', function(){
                    $( this ).find( '.js-panel-background' ).velocity( 'stop' ).velocity({
                        opacity: '0.2'
                    }, 300 );
                });

                $( 'body' ).on( 'mouseleave', '.js-stream-row', function(){
                    $( this ).find( '.js-panel-background' ).velocity( 'stop' ).velocity({
                        opacity: '0'
                    }, 300 );
                });
            },
            loadStreams : function(){
                this.loadData( 'hitbox' );
                this.loadData( 'twitch' );
                this.loadData( 'azubu' );
                this.loadData( 'mlg' );
            },
            loadTemplates : function(){
                this.loadTemplate( 'match' );
                this.loadTemplate( 'stream' );
            },
            loadCountries : function(){
                var _this = this,
                    xhr = $.ajax({
                        url: 'resources/countries.json'
                    });

                this.requestsSent = this.requestsSent + 1;

                xhr.done(function( response ){
                    _this.requestsDone = _this.requestsDone + 1;

                    _this.updateProgressbar();

                    _this.handleCountriesLoad( response );
                });
            },
            handleCountriesLoad : function( countriesData ){
                var i;

                for( i = 0; i < countriesData.length; i = i + 1 ){
                    this.countries[ countriesData[ i ].name.toLowerCase() ] = countriesData[ i ][ 'alpha-2' ].toLowerCase();
                }
            },
            loadTemplate : function( template ){
                var _this = this,
                    xhr = $.ajax({
                        url: 'resources/templates/' + template + '.handlebars'
                    });

                this.requestsSent = this.requestsSent + 1;

                xhr.done(function( response ){
                    _this.requestsDone = _this.requestsDone + 1;

                    _this.updateProgressbar();

                    _this.templates[ template ] = Handlebars.compile( response );
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

                    _this.updateProgressbar();

                    _this.handleResponse( response, service );
                });
            },
            getMatchIdentifier : function( match ){
                return [ match.teams[ 0 ].identifier, match.teams[ 1 ].identifier ].sort().toString();
            },
            handleResponse : function( response, service ){
                var _this = this;

                // Add frontend data to each match
                $.each( response, function( matchIndex, matchData ){
                    var numberOfCountries = 0;

                    $.each( matchData.streams, function( streamIndex, streamData ){
                        response[ matchIndex ].streams[ streamIndex ].live = 1;
                    });

                    $.each( matchData.teams, function( teamIndex, teamData ){
                        if( _this.countries[ teamData.identifier ] !== undefined ){
                            response[ matchIndex ].teams[ teamIndex ].country = _this.countries[ teamData.identifier ];
                            numberOfCountries = numberOfCountries + 1;
                        }
                    });

                    // Special case when we actually match only one country
                    if( numberOfCountries > 0 && numberOfCountries < matchData.teams.length ){
                        $.each( matchData.teams, function( teamIndex, teamData ){
                            if( response[ matchIndex ].teams[ teamIndex ].country ) {
                                delete response[ matchIndex ].teams[ teamIndex ].country;
                            }

                            response[ matchIndex ].teams[ teamIndex ].identifier = _this.unknownTeamIdentifier;
                            response[ matchIndex ].teams[ teamIndex ].name = '???';
                        });
                    }
                });

                // Loop over all matches we got in the response
                $.each( response, function( index, data ){
                    var identifier = _this.getMatchIdentifier( data );

                    // The match isn't listed, just add the data from the response
                    if( _this.matches[ identifier ] === undefined ){
                        _this.matches[ identifier ] = data;
                    } else {
                        // Loop over all the matches streams
                        $.each( _this.matches[ identifier ].streams, function( streamIndex, streamData ){
                            // Check if the stream is already listed for that particular match
                            $.each( data.streams, function( dataStreamIndex, dataStreamData ){
                                if( streamData.name == dataStreamData.name ){
                                    // The stream is listed, update data and remove it from the raw response
                                    _this.matches[ identifier ].streams[ streamIndex ] = dataStreamData;
                                    data.streams.splice( dataStreamIndex, 1 );
                                    return false;
                                }
                            });
                        });

                        // Data streams should only hold streams that are not already listed, so add them
                        _this.matches[ identifier ].streams = _this.matches[ identifier ].streams.concat( data.streams );
                    }
                });

                // Loop over all matches
                $.each( _this.matches, function( matchIndex, matchData ){
                    if( matchData.streams.length > 0 ){
                        // Loop over all a match's streams
                        $.each( matchData.streams, function( streamIndex, streamData ){
                            // Check if the stream matches the service and isn't live
                            if( streamData.service === service && !streamData.live ){
                                _this.matches[ matchIndex ].streams.splice( streamIndex, 1 );
                            } else if( streamData.service === service ){
                                _this.matches[ matchIndex ].streams[ streamIndex ].live = false;
                            }
                        });
                    }

                    // If a match doesn't have any streams any more, remove it
                    if( matchData.streams.length === 0 ){
                        delete _this.matches[ matchIndex ];
                        $( '[data-identifier="' + _this.getMatchIdentifier( matchData ) + '"]' ).velocity( 'transition.fadeOut', {
                            complete : function( element ){
                                $( element ).remove();
                            }
                        });

                        return true;
                    }
                });

                this.updateData();
            },
            updateProgressbar : function(){
                var _this = this;

                if( this.$progressBar.length > 0 ){
                    if( this.requestsSent == this.requestsDone ) {
                        this.$progressBar.css({
                            width: '100%'
                        });

                        // Try to wait until the progressbar is filled before removing it
                        setTimeout( function(){
                            _this.$progressBar.remove();
                        }, 600 );
                    } else {
                        this.$progressBar.css({
                            width: ( _this.requestsDone / _this.requestsSent * 100 ).toString() + '%'
                        });
                    }
                }

            },
            renderMatch : function( match ){
                var $markup,
                    streamIndex,
                    _this = this,
                    $streamsWrapper,
                    matchIdentifier = _this.getMatchIdentifier( match );

                if( !match.rendered ){
                    if( matchIdentifier === this.unknownTeamIdentifier + ',' + this.unknownTeamIdentifier ){
                        $markup = $( '.js-unknown-matches' ).attr( 'data-identifier', matchIdentifier  );
                        match.rendered = true;
                    } else {
                        $markup = $( this.templates[ 'match' ]( match ) )
                            .attr( 'data-identifier', matchIdentifier  )
                            .css({
                                opacity: 0
                            });
                    }
                } else {
                    $markup = $( '[data-identifier="' + matchIdentifier + '"]' );
                }

                $streamsWrapper = $markup.find( '.js-streams-wrapper' );

                for( streamIndex = 0; streamIndex < match.streams.length; streamIndex = streamIndex + 1 ){
                    this.renderStream( match.streams[ streamIndex ], $streamsWrapper );
                }

                if( !match.rendered ){
                    this.$matchesList.append( $markup );
                    $markup.velocity( 'transition.fadeIn', {
                        stagger: 250
                    });

                    match.rendered = true;
                }

                // Remove streams that are no longer live
                $markup.find( '.js-stream-row' ).not( '[data-live="yes"]' ).remove().end().removeAttr( 'data-live' );
            },
            renderStream : function( stream, $wrapperMarkup ){
                var $streamMarkup,
                    streamIdentifier = stream.service + '.' + stream.name,
                    $renderedStream = $wrapperMarkup.find( '[data-identifier="' + streamIdentifier + '"]' );

                console.log( $wrapperMarkup );

                $streamMarkup = $( this.templates[ 'stream' ]( stream ) )
                    .attr( 'data-identifier', streamIdentifier )
                    .attr( 'data-live', 'yes' );

                $streamMarkup.popover({
                    container: 'body',
                    mouseOffset: 20,
                    followMouse: true
                });

                if( $renderedStream.length > 0 ){
                    $renderedStream.replaceWith( $streamMarkup );
                } else {
                    $wrapperMarkup.append( $streamMarkup );
                }
            },
            updateData : function(){
                var matchIdentifier,
                    _this = this,
                    numberOfMatches = Object.keys( this.matches ).length;

                if( this.matches === {} && this.templates === false ){
                    setTimeout( function(){
                        matches.updateData();
                    }, 50 );

                    return false;
                }

                if( this.requestsSent == this.requestsDone ) {
                    this.updateProgressbar();

                    if( numberOfMatches === 0 ){
                        this.$noMatches.show();
                    }
                }

                if( numberOfMatches > 0 ){
                    $( '.popover' ).remove();
                    this.$noMatches.hide();



                    for( matchIdentifier in this.matches ){
                        if( this.matches.hasOwnProperty( matchIdentifier ) ){
                            this.renderMatch( this.matches[ matchIdentifier ] );
                        }
                    }
                }

                // Show and hide headers as neccesary
                if( $( '.js-matches' ).find( '.js-stream-row' ).length > 0 ){
                    $( '.js-matches' ).find( 'h1' ).css({
                        display: 'block'
                    });
                } else {
                    $( '.js-matches' ).find( 'h1' ).css({
                        display: 'none'
                    });
                }

                if( $( '.js-unknown-matches' ).find( '.js-stream-row' ).length > 0 ){
                    $( '.js-unknown-matches' ).find( 'h2' ).css({
                        display: 'block'
                    });
                } else {
                    $( '.js-unknown-matches' ).find( 'h2' ).css({
                        display: 'none'
                    });
                }
            }
        };

    window.matches = matches;

    $(function(){
        matches.init();
    });
})( $ );
