import WebSocket from "ws";

const ws = new WebSocket( "ws://localhost:8080" );

const mockID = "rosc.module.testsocket";

const mockdata = {
    identifier: {
        type: "identifier",
        payload: {
            id: mockID
        }
    },
    update: {
        type: "update",
        payload: {
            id: mockID,
            connectedOVR: true,
            leftThumb: 0,
            rightThumb: 0,
            isIndex: false
        }
    }
};

ws.on( "open", function open() {
    ws.send( JSON.stringify( mockdata.identifier ) );

    SendData();
} );

function SendData() {
    setInterval( () => {
        const rnd = () => Math.floor( Math.random() * 5 );

        mockdata.update.payload.leftThumb = rnd();
        mockdata.update.payload.rightThumb = rnd();

        ws.send( JSON.stringify( mockdata.update ) );
    }, 200 );
}