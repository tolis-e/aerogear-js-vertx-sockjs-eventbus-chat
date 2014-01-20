$( document ).ready( function () {
    
    var client, 
        destination,
        onsubscribe;

    $( '#connect_form' ).submit( function ( e ) {
        
        e.preventDefault();

        var url = $( '#connect_url' ).val();
        destination = $( "#destination" ).val();

        // create AeroGear Notifier
        client = AeroGear.Notifier({
            name: "vertx",
            type: "vertx",
            settings: {
                autoConnect: true,
                connectURL: url
            }
        }).clients.vertx;

        var ondisconnect = function () {
            $( '#disconnect' ).fadeOut({
                duration: 'fast'
            });
            $( '#unsubscribe' ).fadeOut({
                duration: 'fast'
            });
            $( '#connect' ).fadeIn();
            $( '#messages' ).empty();
            $( '#send_form_input' ).attr( 'disabled', 'disabled' );
        },
        onconnect = function () {
            $( '#connect').fadeOut({
                duration: 'fast'
            });
            $( '#disconnect' ).fadeIn();
            $( '#unsubscribe' ).fadeIn();
            $( '#send_form_input' ).removeAttr( 'disabled' );

            onsubscribe = function (message) {
                $( "#messages" ).append( "<p>" + message + "</p>\n" );
            };

            // subscribe
            client.subscribe({
                address: destination,
                    callback: onsubscribe
            }, true);
        };

        client.connect({
            onConnect: onconnect,
            onDisconnect: ondisconnect,
            onConnectError: function () {
                console.log( '### Connection error' );
            }
        });
    });

    $( '#disconnect_form' ).submit( function ( e ) {
        
        e.preventDefault();
        client.disconnect();
    });
    
    $( '#unsubscribe_form' ).submit( function ( e ) {
        e.preventDefault();
        client.unsubscribe( [{ 
            address: destination,
            callback: onsubscribe
        }]);

        $( '#unsubscribe' ).fadeOut({
            duration: 'fast'
        });
    });

    $( '#send_form' ).submit( function ( e ) {

        e.preventDefault();
        var text = $( '#send_form_input' ).val();
        if (text) {
            client.send( destination, text, true );
            $('#send_form_input').val( '' );
        }
    });
});
