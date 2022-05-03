import { WebSocketServer } from "ws";
import SpawnModule from "./electron/module-spawner";

const wss = new WebSocketServer( { port: 8080 } );

let connections = {
    frontend: null,
    modules: []
}

console.log("Node Version: ", process.version);

wss.on( "connection", ( ws ) => {
    ws.on( "message", ( data ) => {
        let message = HandleMessage(data);
        console.log( "received: %s", message );
        if ( message && !message.type ) return;

        switch (message.type) {
            case "identifier":
                const match = /rosc\.module\.(.+)/g.exec(message.id);
                if ( match ) {
                    connections = {
                        ...connections,
                        modules: [
                            ...connections.modules,
                            {
                                id: message.id,
                                socket: ws
                            }
                        ]
                    }
                    break;
                }
                connections = {
                    ...connections,
                    frontend: ws
                }
                break;

            case "update":
                connections.frontend.send(SendUpdate(message.payload))
                break;
        
            default:
                break;
        }
    } );

    ws.send( "connected" );
} );

wss.on("listening", () => {
    console.log("Server is listening!");

    const module = SpawnModule("thumbparams", true);
})

const SendUpdate = (payload) => JSON.stringify({
    type: "update",
    payload
});

function isJsonString( str ) {
    try {
        JSON.parse( str );
    } catch ( e ) {
        return false;
    }
    return true;
}

function HandleMessage(message) {
    message = message.toString();
    if (isJsonString(message)) {
        return JSON.parse(message);
    }

    return message;
}