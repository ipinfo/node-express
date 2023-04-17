declare module "ipinfo-express" {
    import { RequestHandler } from "express";

    interface IPinfoMiddlewareOptions {
        token?: string;
        cache?: any;
        timeout?: number;
        filter?: (ip: string) => boolean;
    }

    interface IPinfoResponse {
        ip: string;
        hostname: string;
        city: string;
        region: string;
        country: string;
        loc: string;
        org: string;
        postal: string;
        timezone: string;
    }

    function ipinfo(options: IPinfoMiddlewareOptions): RequestHandler;

    export = ipinfo;
}
