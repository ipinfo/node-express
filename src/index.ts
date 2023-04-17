import { IPinfoWrapper } from "node-ipinfo";
import defaultIPSelector from "./ip-selector/default-ip-selector";
import originatingIPSelector from "./ip-selector/originating-ip-selector";

type MiddlewareOptions = {
    token?: string;
    cache?: any;
    timeout?: number;
    ipSelector?: (req: any) => string;
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
        req.ipinfo = await ipinfo.lookupIp(ip);
        next();
    };
};

export default ipinfoMiddleware;
export { defaultIPSelector, originatingIPSelector };
