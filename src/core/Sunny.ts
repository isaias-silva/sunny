import axios, { Axios } from 'axios'
import { Causes, Iconnection, Iparams } from '../interfaces/connection'
import * as qrcodeTerminal from "qrcode-terminal";
import { EventEmitter } from 'events'
import { Emitter } from './Emitter';
import logger from './Logger';
import { delay } from '../utils/delay';

/**
 * @author zack
 * @version 1.0.0
 */

export class Sunny {

    private URL = "https://www.tiktok.com"
    private MAX_REQS = 2
    private client: Axios;
    
    private executionProps = { inMakeConnection: false };

    public readonly ev: Emitter;

    constructor() {
        this.ev = new Emitter()
        this.client = axios.create({
            baseURL: this.URL
        });

    }

    public async makeConnection(params: Iparams) {
        
        if (this.executionProps.inMakeConnection) {
            return
        }
        logger.info("booting connection")

        this.executionProps.inMakeConnection = true;

        const { sdk_version, aid, next, seconds_to_refresh, qrInTerminal } = params

        let reqs = 0
        while (true) {
            params['sdk_version'] = sdk_version || '2.1.5-tiktokbeta.1'
            params['aid'] = aid || 1459
            params["next"] = next || 'https://www.tiktok.com'

            if (reqs >= this.MAX_REQS) {
                logger.warn("MANY REQUESTS")
                this.executionProps.inMakeConnection = false
                return this.ev.emit("s.conn", { open: false, cause: Causes.MANY_REQUESTS })

            }

            const connection_data: Iconnection | null = await this.client.get("/passport/web/get_qrcode/", {
                params
            }).then(res => res.data.data).catch(err => null)

            if (!connection_data) {
                logger.error("internal error in connection")
                this.executionProps.inMakeConnection = false
                return this.ev.emit("s.conn", { open: false, cause: Causes.SERVER_ERROR })

            }

            reqs += 1


            connection_data.open = true
            logger.info(JSON.stringify(connection_data))
            this.ev.emit("s.conn", connection_data)

            if (qrInTerminal && connection_data.qrcode_index_url) {
                qrcodeTerminal.generate(connection_data.qrcode_index_url, { small: true })
            }

            await delay(seconds_to_refresh * 1000)

        }

    }



}