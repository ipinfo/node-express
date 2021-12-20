var { IPinfoWrapper } = require('node-ipinfo');

module.exports = function (token) {
    if (!token) {
        token = ''
    }

    let ipinfo = new IPinfoWrapper(token)

    var middleware = function (req, res, next) {
        ipinfo.lookupIp(req.ip).then((response) => {
            req.ipinfo = response;
            next();
        });
    }

    return middleware
}