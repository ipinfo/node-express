import { Request } from "express";

const defaultIPSelector = (req: Request): string | undefined => {
    const xForwardedFor = req.header("x-forwarded-for");
    if (!xForwardedFor || xForwardedFor.trim() === "") {
        return req.ip;
    } else {
        const ips = xForwardedFor.split(",");
        return ips[0].trim();
    }
};

export default defaultIPSelector;
