declare module "ipinfo-express" {
    import { RequestHandler } from "express";

    interface IPinfoMiddlewareOptions {
        token?: string;
        cache?: any;
        timeout?: number;
        filter?: (ip: string) => boolean;
    }

    export interface Asn {
        asn: string;
        name: string;
        domain: string;
        route: string;
        type: string;
    }

    export interface Company {
        name: string;
        domain: string;
        type: string;
    }

    export interface Carrier {
        name: string;
        mcc: string;
        mnc: string;
    }

    export interface Privacy {
        vpn: boolean;
        proxy: boolean;
        tor: boolean;
        relay: boolean;
        hosting: boolean;
        service: string;
    }

    export interface Abuse {
        address: string;
        country: string;
        countryCode: string;
        email: string;
        name: string;
        network: string;
        phone: string;
    }

    export interface Domains {
        ip: string;
        total: number;
        domains: string[];
    }

    export interface CountryFlag {
        emoji: string;
        unicode: string;
    }

    export interface CountryCurrency {
        code: string;
        symbol: string;
    }

    export interface Continent {
        code: string;
        name: string;
    }

    export interface IPinfoResponse {
        ip: string;
        hostname: string;
        bogon: boolean;
        anycast: boolean;
        city: string;
        region: string;
        country: string;
        countryFlag: CountryFlag;
        countryCurrency: CountryCurrency;
        continent: Continent;
        isEU: boolean;
        countryCode: string;
        loc: string;
        org: string;
        postal: string;
        timezone: string;
        asn: Asn;
        company: Company;
        carrier: Carrier;
        privacy: Privacy;
        abuse: Abuse;
        domains: Domains;
    }

    function ipinfo(options: IPinfoMiddlewareOptions): RequestHandler;

    export = ipinfo;
}
