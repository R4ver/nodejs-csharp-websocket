using ROSC.WS;

namespace ROSC
{
    public class ThumbParameters {
        public string id = "rosc.module.thumbparameters";
        public int leftThumb {get; set;} = 0;
        public int rightThumb {get; set;} = 0;
        public bool isIndex {get; set;} = false;
        public bool connectedToOVR {get; set;} = false;
    }
    class ThumbParamsModule {
        static ThumbParameters thumbParams = new ThumbParameters();
        static WebSocketHelper WS = new WebSocketHelper();
        public static void Main(string[] args) {
            WS.Init();

            WS.Socket.ReconnectionHappened.Subscribe(info =>
            {
                Console.WriteLine($"Reconnection happened, type: {info.Type}, url: {WS.Socket.Url}");
                if ( info.Type.ToString() == "Initial" ) {
                    WS.SendIdentifier(thumbParams.id);
                    StartListening();
                }
            });

            ThumbTesting();

            Console.ReadLine();
        }

        public static void StartListening()
        {
            WS.Socket.MessageReceived.Subscribe(msg =>
            {
                var message = msg.ToString();
                Console.WriteLine($"Message received: {message}");
            });
        }

        public static void ThumbTesting()
        {
            while(true)
            {
                Random rnd = new Random();
                int leftThumb = rnd.Next(0, 4);
                int rightThumb = rnd.Next(0, 4);

                thumbParams.leftThumb = leftThumb;
                thumbParams.rightThumb = rightThumb;

                WS.SendUpdate(thumbParams);
                
                Thread.Sleep(2000);
            }
        }
    }
}