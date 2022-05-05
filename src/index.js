const socket = new WebSocket( "ws://localhost:8080", "rosc.frontend" );
const OVR = document.getElementById( "OVR" );
const ctrlType = document.getElementById( "controllerType" );
const leftThumb = document.getElementById( "leftThumb" );
const rightThumb = document.getElementById( "rightThumb" );
const toggle = document.getElementById( "toggle" );

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
    const data = event.data;

    if ( !isJsonString( data ) ) return;
    const jsondata = JSON.parse( data );
    console.log( jsondata );
    // const { payload } = JSON.parse( data );

    // OVR.innerText = `Connected to OVR: ${payload.connectedToOVR}`;
    // ctrlType.innerText = `Controller Type: ${payload.isIndex ? "Index Knuckles" : "Quest 2"}`;
    // leftThumb.innerText = `Left Thumb: ${payload.leftThumb}`;
    // rightThumb.innerText = `Right Thumb: ${payload.rightThumb}`;
} );

function isJsonString( str ) {
    try {
        JSON.parse( str );
    } catch ( e ) {
        return false;
    }
    return true;
}