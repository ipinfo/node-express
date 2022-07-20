module.exports = (req) => {
    const xForwardedFor = req.header("x-forwarded-for");
    if (!xForwardedFor || xForwardedFor.trim() === "") {
        return req.ip;
    } else {
        const ips = xForwardedFor.split(",");
        return ips[0].trim();
    }
};
