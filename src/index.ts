import {
    IPinfoWrapper,
    IPinfo,
    IPinfoLiteWrapper,
    IPinfoCoreWrapper
} from "node-ipinfo";
import defaultIPSelector from "./ip-selector/default-ip-selector";
import originatingIPSelector from "./ip-selector/originating-ip-selector";
import { IPinfoLite, IPinfoCore, IPBogon } from "node-ipinfo/dist/src/common";

type MiddlewareOptions = {
    token?: string;
    cache?: any;
    timeout?: number;
    ipSelector?: (req: any) => string | undefined;
};

const ipinfoMiddleware = ({
    token = "",
    cache,
    timeout,
    ipSelector
}: MiddlewareOptions = {}) => {
    const ipinfo = new IPinfoWrapper(token, cache, timeout);
    if (ipSelector == null || typeof ipSelector !== "function") {
        ipSelector = defaultIPSelector;
    }
    return async (req: any, _: any, next: any) => {
        const ip = ipSelector?.(req) ?? defaultIPSelector(req);
        if (ip) {
            const ipInfo: IPinfo = await ipinfo.lookupIp(ip);
            req.ipinfo = ipInfo;
        }
        next();
    };
};

const ipinfoLiteMiddleware = ({
    token = "",
    cache,
    timeout,
    ipSelector
}: MiddlewareOptions = {}) => {
    const ipinfo = new IPinfoLiteWrapper(token, cache, timeout);
    if (ipSelector == null || typeof ipSelector !== "function") {
        ipSelector = defaultIPSelector;
    }
    return async (req: any, _: any, next: any) => {
        const ip = ipSelector?.(req) ?? defaultIPSelector(req);
        if (ip) {
            const ipInfo: IPinfoLite | IPBogon = await ipinfo.lookupIp(ip);
            req.ipinfo = ipInfo;
        }
        next();
    };
};

const ipinfoCoreMiddleware = ({
    token = "",
    cache,
    timeout,
    ipSelector
}: MiddlewareOptions = {}) => {
    const ipinfo = new IPinfoCoreWrapper(token, cache, timeout);
    if (ipSelector == null || typeof ipSelector !== "function") {
        ipSelector = defaultIPSelector;
    }
    return async (req: any, _: any, next: any) => {
        const ip = ipSelector?.(req) ?? defaultIPSelector(req);
        if (ip) {
            const ipInfo: IPinfoCore | IPBogon = await ipinfo.lookupIp(ip);
            req.ipinfo = ipInfo;
        }
        next();
    };
};

export default ipinfoMiddleware;
export {
    defaultIPSelector,
    originatingIPSelector,
    ipinfoLiteMiddleware as ipinfoLite,
    ipinfoCoreMiddleware as ipinfoCore
};
