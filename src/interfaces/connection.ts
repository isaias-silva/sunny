export interface Iconnection{
    open:boolean;
    app_name?:string,
    expire_time?:number,
    qrcode?:string,
    token?:string,
    qrcode_index_url?:string
    cause?:Causes
}

export enum Causes{
    MANY_REQUESTS,
    SERVER_ERROR,
}
export interface Iparams {
    next?: string
    sdk_version?: string
    aid?: number
    seconds_to_refresh: number
    qrInTerminal: boolean

}