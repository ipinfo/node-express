declare module "ipinfo-express" {
    import { RequestHandler } from "express";
  
    interface IPInfoMiddlewareOptions {
      token?: string;
      cache?: any;
      timeout?: number;
      filter?: (ip: string) => boolean;
    }
  
    interface IPInfoResponse {
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
  
    function ipinfo(options: IPInfoMiddlewareOptions): RequestHandler;
  
    export = ipinfo;
  }
  