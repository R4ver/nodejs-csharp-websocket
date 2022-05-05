import { WebSocketServer } from "ws";
import MessageHandler from "./electron/message-handler";
// import SpawnModule from "./electron/module-spawner";
import * as moduleConfigs from "./modules/module-info";

const wss = new WebSocketServer( { port: 8080 } );

let state = {
    frontend: null,
    modules: [],
    isListening: false
};

console.log( "Node Version: ", process.version );

wss.on( "connection", ( ws ) => {
    ws.on( "message", ( data ) => {
        let message = FormatMessage( data );

        // console.log( "Message received: ", message );
        
        MessageHandler( state, message, ws, ( newState ) => {
            state = {
                ...newState
            };
        } );
    } );

    ws.send( "connected" );
} );

wss.on( "listening", () => {
    console.log( "Server is listening!" );

    state = {
        ...state,
        isListening: true
    };
} );

// const spawnActiveModules = () => {

//     // SpawnModule( "thumbparams", true );
// };



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