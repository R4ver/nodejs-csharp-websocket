const socket = new WebSocket( "ws://localhost:8080", "rosc.frontend" );
const OVR = document.getElementById( "OVR" );
const ctrlType = document.getElementById( "controllerType" );
const leftThumb = document.getElementById( "leftThumb" );
const rightThumb = document.getElementById( "rightThumb" );
const toggle = document.getElementById( "toggle" );

let state = {};


toggle.onclick = ( e ) => {
    let value = e.target.checked;
    localStorage.setItem( "module_active", JSON.stringify( {
        id: "rosc.module.thumbparameters",
        active: value
    } ) );
};

// Connection opened
socket.addEventListener( "open", function () {
    const identifier = {
        type: "identifier",
        payload: {
            id: "rosc.frontend"
        }
    };
    socket.send( JSON.stringify( identifier ) );
} );

// Listen for messages
socket.addEventListener( "message", function ( event ) {
    const message = FormatMessage( event.data );
    MessageHandler( state, message, ( newState ) => {
        state = {
            ...newState
        };
    } );
    
} );

function isJsonString( str ) {
    try {
        JSON.parse( str );
    } catch ( e ) {
        return false;
    }
    return true;
}

function FormatMessage( message ) {
    message = message.toString();
    if ( isJsonString( message ) ) {
        return JSON.parse( message );
    }

    return message;
}

function MessageHandler( state, { type, payload }, callback ) {
    switch ( type ) {
    case "update":
        console.log( "Update: ", payload );
        break;

    default:
        console.log( "Message not handled by type: ", { state, type, ...payload } );
        break;
    }

    callback( state );
}

const SendUpdate = ( payload ) => JSON.stringify( {
    type: "update",
    payload
} );