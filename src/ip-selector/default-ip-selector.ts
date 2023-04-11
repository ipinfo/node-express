import { Request } from "express";

const originatingIPSelector = (req: Request): string => {
  return req.ip;
};

export default originatingIPSelector;

