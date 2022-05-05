window.Pixel = {};
let Pixel = window.Pixel;
var __awaiter = ( undefined && undefined.__awaiter ) || function ( thisArg, _arguments, P, generator ) {
    function adopt( value ) { return value instanceof P ? value : new P( function ( resolve ) { resolve( value ); } ); }
    return new ( P || ( P = Promise ) )( function ( resolve, reject ) {
        function fulfilled( value ) { try { step( generator.next( value ) ); } catch ( e ) { reject( e ); } }
        function rejected( value ) { try { step( generator["throw"]( value ) ); } catch ( e ) { reject( e ); } }
        function step( result ) { result.done ? resolve( result.value ) : adopt( result.value ).then( fulfilled, rejected ); }
        step( ( generator = generator.apply( thisArg, _arguments || [] ) ).next() );
    } );
};
const dependencies = [
    "https://cdn.jsdelivr.net/npm/preact@10.6.4/dist/preact.min.js",
    "https://cdn.jsdelivr.net/npm/preact@10.6.4/hooks/dist/hooks.umd.js",
    "https://cdn.jsdelivr.net/npm/htm@3.1.0/dist/htm.umd.js"
];
const loadWithPixel = () => __awaiter( void 0, void 0, void 0, function* () {
    yield window.Pixel.loadScripts( dependencies[0] );
    yield window.Pixel.loadScripts( [
        dependencies[1],
        dependencies[2]
    ] );
} );
const loadScriptsDev = ( src = dependencies ) => {
    if ( typeof src === "string" ) {
        return new Promise( ( resolve, reject ) => {
            const script = document.createElement( "script" );
            script.type = "text/javascript";
            script.onload = resolve;
            script.onerror = reject;
            script.src = src;
            document.head.append( script );
        } );
    }
    else if ( typeof src === "object" ) {
        return new Promise( ( resolve ) => {
            const promises = [];
            src.forEach( ( s ) => {
                promises.push( loadScriptsDev( s ) );
            } );
            Promise.all( promises ).then( resolve );
        } );
    }
};

// CONCATENATED MODULE: ./src/hooks/useEvent.tsx
const useEvent = ( events ) => {
    const [s] = Pixel.Preact.hooks.useState( events );
    const [data, setData] = Pixel.Preact.hooks.useState( {} );
    Pixel.Preact.hooks.useEffect( () => {
        s.forEach( ( e ) => {
            Pixel.on( e, ( msg ) => {
                setData( ( prev ) => ( Object.assign( Object.assign( {}, prev ), { [e]: Object.assign( { type: e, id: `${e}-${Date.now()}` }, msg ) } ) ) );
            } );
        } );
    }, [s] );
    const clearData = ( callback ) => {
        if ( callback ) {
            setData( ( prev ) => callback( prev ) );
            return;
        }
        setData( {} );
    };
    const clearKey = ( key ) => {
        setData( ( prev ) => {
            delete prev[key];
            return Object.assign( {}, prev );
        } );
    };
    return { data, clearData, clearKey };
};

// CONCATENATED MODULE: ./src/hooks/useInterval.tsx
const useInterval = ( callback, delay, dependencies = [] ) => {
    const savedCallback = Pixel.Preact.hooks.useRef();
    Pixel.Preact.hooks.useEffect( () => {
        savedCallback.current = callback;
    }, [callback] );
    Pixel.Preact.hooks.useEffect( () => {
        const handler = ( ...args ) => savedCallback.current( ...args, ...dependencies );
        if ( delay !== null && delay !== 0 ) {
            const id = setInterval( handler, delay );
            return () => clearInterval( id );
        }
    }, [delay, ...dependencies] );
};

// CONCATENATED MODULE: ./src/index.ts
var src_awaiter = ( undefined && undefined.__awaiter ) || function ( thisArg, _arguments, P, generator ) {
    function adopt( value ) { return value instanceof P ? value : new P( function ( resolve ) { resolve( value ); } ); }
    return new ( P || ( P = Promise ) )( function ( resolve, reject ) {
        function fulfilled( value ) { try { step( generator.next( value ) ); } catch ( e ) { reject( e ); } }
        function rejected( value ) { try { step( generator["throw"]( value ) ); } catch ( e ) { reject( e ); } }
        function step( result ) { result.done ? resolve( result.value ) : adopt( result.value ).then( fulfilled, rejected ); }
        step( ( generator = generator.apply( thisArg, _arguments || [] ) ).next() );
    } );
};


window.Pixel.Preact = {};
window.Pixel.Preact.Init = () => src_awaiter( void 0, void 0, void 0, function* () {
    if ( false ) { }
    else {
        yield loadScriptsDev();
    }
    const preact = window.preact;
    const preactHooks = window.preactHooks;
    const htm = window.htm;
    const Pixel = window.Pixel;
    Pixel.Preact = Object.assign( Object.assign( { _htm: htm.bind( preact.h ) }, preact ), {
        hooks: Object.assign( Object.assign( {}, preactHooks ), {
            useEvent: useEvent,
            useInterval: useInterval
        } ), components: {}, template: ( ...args ) => window.Pixel.Preact._htm( ...args ), render: ( node, domElement ) => preact.render( preact.h( node ), domElement )
    } );
    if ( false ) { }
} );

window.Pixel.Preact.Init();