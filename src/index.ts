import { Sunny } from "./Sunny";



const tikSunny = new Sunny()
tikSunny.connect({
    
    time_to_refresh: 10,
    qrInTerminal: false
})

tikSunny.ev.on('s.conn', (msg) => {
    console.log(msg)
})