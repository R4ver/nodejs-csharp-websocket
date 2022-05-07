const socket = new WebSocket( "ws://localhost:8080", "rosc.frontend" );
const OVR = document.getElementById( "OVR" );
const ctrlType = document.getElementById( "controllerType" );
const leftThumb = document.getElementById( "leftThumb" );
const rightThumb = document.getElementById( "rightThumb" );
const toggle = document.getElementById( "toggle" );

let state = {
    modules: {
        
    }
};


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
    MessageHandler( state, message, ( newState, updatedID ) => {
        state = {
            ...newState
        };

        UpdateUI( updatedID );
    } );
    
} );

function UpdateUI( updatedID ) {
    if ( !updatedID ) return;

    const module = state.modules[updatedID];

    if ( updatedID == "rosc.module.testsocket" ) {
        OVR.innerText = `Connected to OVR: ${module.connectedOVR}`;
        ctrlType.innerText = `Controller Type: ${module.isIndex ? "Index Knuckles" : "Quest 2"}`;
        leftThumb.innerText = `Left Thumb: ${module.leftThumb}`;
        rightThumb.innerText = `Right Thumb: ${module.rightThumb}`;
    }    
}

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
    var updatedID;
    switch ( type ) {
    case "update":
        state = {
            ...state,
            modules: {
                ...state.modules,
                [payload.id]: {
                    ...payload
                }
            }
        };
        updatedID = payload.id;
        break;

    default:
        console.log( "Message not handled by type: ", { state, type, ...payload } );
        break;
    }

    callback( state, updatedID );
}

const SendUpdate = ( payload ) => JSON.stringify( {
    type: "update",
    payload
} );