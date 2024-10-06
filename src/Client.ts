import puppeteer, { Browser, Page } from "puppeteer";

export class Client {

    private url: string = 'https://www.tiktok.com/login/qrcode'
    private page?: Page;
    private browser?: Browser;
    public async connect() {

        this.browser = await puppeteer.launch({ browser: 'firefox', headless: false });
        this.page = await this.browser.newPage();
        await this.page.setViewport({width: 461, height: 600});
        await this.page.goto(this.url)

        await this.extractQr()

        return true;
    }

    private async click(selector: string) {
        if (this.page) {

            await this.page.waitForSelector(selector)
            await this.page.click(selector)
        }
    }
    private async extractQr() {
        if (this.page) {
           
            await this.page.waitForSelector('canvas')
            console.log('qrcode loaded')


        }
    }
}