import { Request } from "express";

const originatingIPSelector = (req: Request): string | undefined => {
    return req.ip;
};

export default originatingIPSelector;
