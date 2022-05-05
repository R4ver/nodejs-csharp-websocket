import WebSocket from "ws";

const ws = new WebSocket( "ws://localhost:8080" );

const mockdata = {
    identifier: {
        type: "identifier",
        payload: {
            id: "rosc.module.testsocket"
        }
    },
    update: {
        type: "update",
        payload: {
            bass: 0,
            lowMid: 0,
            highMid: 0
        }
    }
};

ws.on( "open", function open() {
    ws.send( JSON.stringify( mockdata.identifier ) );

    SendData();
} );

function SendData() {
    setInterval( () => {
        ws.send( JSON.stringify( mockdata.update ) );
    }, 2000 );
}