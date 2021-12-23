const { IPinfoWrapper } = require("node-ipinfo");

module.exports = ({ token = "", cache, timeout }) => {
    const ipinfo = new IPinfoWrapper(token, cache, timeout);
    return async (req, _, next) => {
        req.ipinfo = await ipinfo.lookupIp(req.ip);
        next();
    };
};
