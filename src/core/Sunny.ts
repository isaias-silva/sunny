import axios, { Axios } from 'axios'
import { Causes, Iconnection, Iparams } from '../interfaces/connection'
import * as qrcodeTerminal from "qrcode-terminal";
import { Emitter } from './Emitter';
import logger from './Logger';
import { delay } from '../utils/delay';
import { CookieJar } from "tough-cookie"
import { wrapper } from 'axios-cookiejar-support'
/**
 * @author zack
 * @version 1.0.0
 */

export class Sunny {

    private URL = "https://www.tiktok.com"
    private MAX_REQS = 5
    private client: Axios;
    private jar: CookieJar;

    private executionProps = {
        inMakeConnection: false,
        observerCookies: false
    };

    public readonly ev: Emitter;

    constructor() {
        this.ev = new Emitter()
        this.jar = new CookieJar();

        this.client = wrapper(axios.create({
            jar: this.jar,
            baseURL: this.URL
        }));

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
                this.executionProps.inMakeConnection = false
                this.executionProps.observerCookies = false

                return this.ev.emit("s.conn", { open: false, cause: Causes.MANY_REQUESTS })

            }

            const connection_data: Iconnection | null = await this.client.get("/passport/web/get_qrcode/", {
                params
            }).then(res => res.data.data).catch(err => null)

            if (!connection_data) {

                this.executionProps.observerCookies = false
                this.executionProps.inMakeConnection = false

                return this.ev.emit("s.conn", { open: false, cause: Causes.SERVER_ERROR })

            }
            this.executionProps.observerCookies = true
            reqs += 1


            connection_data.open = true
            logger.info(JSON.stringify(connection_data))
            this.ev.emit("s.conn", connection_data)

            if (qrInTerminal && connection_data.qrcode_index_url) {
                qrcodeTerminal.generate(connection_data.qrcode_index_url, { small: true })
            }
            this.checkSession()
            await delay(seconds_to_refresh * 1000)

        }

    }

    private async checkSession() {
        if (this.executionProps.observerCookies) {
    
            console.log(this.jar.toJSON())

        }
    }


}