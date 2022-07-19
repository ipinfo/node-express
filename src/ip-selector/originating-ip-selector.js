module.exports = (req) => {
    const xForwardedFor = req.header('x-forwarded-for');
    if (xForwardedFor && xForwardedFor.trim() === "") {
        const ips = xForwardedFor.split(',');
        return ips[0].trim();
    } else {
        return req.ip;
    }
};
