const { IPinfoWrapper } = require("node-ipinfo");
const defaultIPSelector = require("./ip-selector/default-ip-selector");
const originatingIPSelector = require("./ip-selector/originating-ip-selector");

module.exports = ({ token = "", cache, timeout, ipSelector }) => {
    const ipinfo = new IPinfoWrapper(token, cache, timeout);
    if (ipSelector == null || typeof ipSelector != "function") {
        ipSelector = defaultIPSelector;
    }
    return async (req, _, next) => {
        const ip = ipSelector(req);
        req.ipinfo = await ipinfo.lookupIp(ip);
        next();
    };
};

module.exports.defaultIPSelector = defaultIPSelector;
module.exports.originatingIPSelector = originatingIPSelector;
