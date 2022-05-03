using System.Runtime.Loader;
using System.Net.WebSockets;
using Websocket.Client;
using System.Diagnostics;
using Newtonsoft.Json;

namespace ROSC.WS
{

    public class WebSocketHelper {
        private readonly ManualResetEvent ExitEvent = new ManualResetEvent(false);
        private static Uri SocketURI = new Uri("ws://localhost:8080");
        private static Func<ClientWebSocket>? Factory = new Func<ClientWebSocket>(() =>
            {
                var client = new ClientWebSocket
                {
                    Options =
                    {
                        KeepAliveInterval = TimeSpan.FromSeconds(300),
                    }
                };
                return client;
            });
        public IWebsocketClient? Socket = new WebsocketClient(SocketURI, Factory);
        
        private Task? _backgroundTask;

        public class Identifier
        {
            public string type {get;} = "identifier";
            public string? id {get; set;}
        }

        public class ModuleUpdate
        {
            public string type {get;} = "update";
            public object? payload {get; set;}
        }

        public void Init()
        {

            AppDomain.CurrentDomain.ProcessExit += CurrentDomainOnProcessExit;
            AssemblyLoadContext.Default.Unloading += DefaultOnUnloading;

            _backgroundTask = Task.Run((Action) BackgroundSocket);
        }

        private void BackgroundSocket()
        {

            Socket.ReconnectTimeout = TimeSpan.FromSeconds(300);
            Socket.ErrorReconnectTimeout = TimeSpan.FromSeconds(30);

            Socket.ReconnectionHappened.Subscribe(info =>
            {
                Console.WriteLine($"Reconnection happened, type: {info.Type}, url: {Socket.Url}");
            });
            Socket.DisconnectionHappened.Subscribe(info =>
                Console.WriteLine($"Disconnection happened, type: {info.Type}"));

            Socket.Start();

            ExitEvent.WaitOne();
        }

        public void SendMessage(String msg)
        {
            if ( !Socket.IsRunning )
                return;

            Console.WriteLine("Sending normal string");
            Socket.Send(msg);
        }

        public void SendMessage(Object obj)
        {
            if ( !Socket.IsRunning )
                return;
                
            Console.WriteLine("Sending JSON");
            string output = JsonConvert.SerializeObject(obj);
            Socket.Send(output);
        }

        public void SendIdentifier(String ID) 
        {
            var identifier = new Identifier();
            identifier.id = ID;
            Console.WriteLine("Sending Identifier");
            SendMessage(identifier);
        }

        public void SendUpdate(Object obj)
        {
            var update = new ModuleUpdate();
            update.payload = obj;
            Console.WriteLine("Sending Module Update");
            SendMessage(update);
        }

        private void CurrentDomainOnProcessExit(object sender, EventArgs eventArgs)
        {
            Debug.WriteLine("Exiting process");
            Socket.Stop(System.Net.WebSockets.WebSocketCloseStatus.NormalClosure, "Process exited");
            ExitEvent.Set();
        }

        private void DefaultOnUnloading(AssemblyLoadContext assemblyLoadContext)
        {
            Debug.WriteLine("Unloading process");
            Socket.Stop(System.Net.WebSockets.WebSocketCloseStatus.NormalClosure, "Process unloaded");         
            ExitEvent.Set();
        }
    }
}