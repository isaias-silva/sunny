export interface Iconnection{
    open:boolean;
    app_name?:string,
    expire_time?:number,
    qrcode?:string,
    token?:string,
    qrcode_index_url?:string
}