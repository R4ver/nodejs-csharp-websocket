import { resolve } from "path";
import { spawn } from "child_process";

export default function SpawnModule( module, isExecuteable = false ) {
    let child;
    const platform = process.platform;

    switch ( isExecuteable ) {
    case true:
        if ( platform === "linux" ) {
            child = spawn( "msc", `../modules/release/${module}.exe` );
        } else {
            child = spawn( resolve( __dirname, `../modules/release/${module}.exe` ) );
        }
        break;
    
    default:
        child = spawn( resolve( __dirname, `../modules/release/${module}.js` ) );
        break;
    }

    child.stdout.setEncoding( "utf8" );
    child.stdout.on( "data", function ( data ) {
        //Here is where the output goes

        console.log( "stdout: " + data );

        data = data.toString();
    } );

    child.stderr.setEncoding( "utf8" );
    child.stderr.on( "data", function ( data ) {
        //Here is where the error output goes

        console.log( "stderr: " + data );

        data = data.toString();
    } );

    child.on( "close", function ( code ) {
        //Here you can get the exit code of the script

        console.log( "closing code: " + code );
    } );

    return child;
}