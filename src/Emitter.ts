import { EventEmitter } from 'events'
import { Iconnection } from './interfaces/Iconnection';

interface IEvents{
    's.conn':(msg: Iconnection) => void;
    's.post':(msg: string) => void;
    's.msg':(msg: string) => void;

}

export class Emitter extends EventEmitter {

    
    emit<K extends keyof IEvents>(event: K, ...args: Parameters<IEvents[K]>): boolean {
        return super.emit(event, ...args);
    }

    
    on<K extends keyof IEvents>(event: K, listener: IEvents[K]): this {
        return super.on(event, listener);
    }

   
    off<K extends keyof IEvents>(event: K, listener: IEvents[K]): this {
        return super.off(event, listener);
    }

}