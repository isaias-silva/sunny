import axios, { Axios } from 'axios'
import { Iconnection } from './interfaces/Iconnection'
import * as qrcodeTerminal from "qrcode-terminal";
import { EventEmitter } from 'events'
import { Emitter } from './Emitter';

export class Sunny {

    private URL_CONNECTION = "https://www.tiktok.com/passport/web/get_qrcode/"
    private MAX_REQS = 3
    private client: Axios;

    ev: Emitter;

    constructor() {
        this.ev = new Emitter()
        this.client = axios.create({});

    }
    public async connect(params: {
        next?: string
        sdk_version?: string
        aid?: number
        time_to_refresh: number
        qrInTerminal: boolean

    }) {

        const { sdk_version, aid, next, time_to_refresh, qrInTerminal } = params

        let reqs = 0;
        const intervalRefresh = setInterval(async () => {
            params['sdk_version'] = sdk_version || '2.1.5-tiktokbeta.1'
            params['aid'] = aid || 1459
            params["next"] = next || 'https://www.tiktok.com'

            if (reqs >= this.MAX_REQS) {
                clearInterval(intervalRefresh)
                return this.ev.emit("s.conn", { open: false })

            }

            const connection_data: Iconnection | null = await this.client.get(this.URL_CONNECTION, {
                params
            }).then(res => res.data.data).catch(err => null)

            if (!connection_data) {
                clearInterval(intervalRefresh)
                throw "INVALID CREDENTIALS";
            }

            reqs += 1

            if (qrInTerminal && connection_data.qrcode_index_url) {
                qrcodeTerminal.generate(connection_data.qrcode_index_url, { small: true })
            }
            connection_data.open = true
            this.ev.emit("s.conn", connection_data)

        }, time_to_refresh * 1000)



    }



}