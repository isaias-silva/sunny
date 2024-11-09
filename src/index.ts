import { Sunny } from "./core/Sunny";
import { Causes } from "./interfaces/connection";




const connect = () => {

    const tikSunny = new Sunny()

    tikSunny.makeConnection({

        seconds_to_refresh: 5,
        qrInTerminal: true,

    })
 

    tikSunny.ev.on('s.conn', (connection) => {
       if(!connection.open){
        if(connection.cause!=Causes.SERVER_ERROR && connection.cause!=Causes.MAX_CONNECTIONS){
           connect()
        }

       }
        
    })
}

connect()

