import { Request, Response, NextFunction } from "express";
import { ipinfoCore, originatingIPSelector } from "../src/index";
import { IPinfoCore } from "node-ipinfo/dist/src/common";

// Mock the node-ipinfo module
const mockLookupIp = jest.fn();
jest.mock("node-ipinfo", () => ({
    IPinfoCoreWrapper: jest.fn().mockImplementation(() => ({
        lookupIp: mockLookupIp
    }))
}));

describe("ipinfoCoreMiddleware", () => {
    const mockToken = "test_token";
    let mockReq: Partial<Request> & { ipinfo?: IPinfoCore };
    let mockRes: Partial<Response>;
    let next: NextFunction;

    beforeEach(() => {
        // Reset mocks before each test
        jest.clearAllMocks();

        // Set up default mock response
        mockLookupIp.mockResolvedValue({
            ip: "1.2.3.4",
            city: "New York",
            country: "US",
            hostname: "example.com",
            org: "Example Org"
        });

        // Setup mock request/response
        mockReq = {
            ip: "1.2.3.4",
            headers: { "x-forwarded-for": "5.6.7.8, 10.0.0.1" },
            header: jest.fn((name: string) => {
                if (name.toLowerCase() === "set-cookie") {
                    return ["mock-cookie-1", "mock-cookie-2"];
                }
                if (name.toLowerCase() === "x-forwarded-for") {
                    return "5.6.7.8, 10.0.0.1";
                }
                return undefined;
            }) as jest.MockedFunction<
                ((name: "set-cookie") => string[] | undefined) &
                    ((name: string) => string | undefined)
            >
        };
        mockRes = {};
        next = jest.fn();
    });

    it("should use defaultIPSelector when no custom selector is provided", async () => {
        const middleware = ipinfoCore({ token: mockToken });

        await middleware(mockReq, mockRes, next);

        expect(mockLookupIp).toHaveBeenCalledWith("1.2.3.4");
        expect(mockReq.ipinfo).toEqual({
            ip: "1.2.3.4",
            city: "New York",
            country: "US",
            hostname: "example.com",
            org: "Example Org"
        });
        expect(next).toHaveBeenCalled();
    });

    it("should use originatingIPSelector when specified", async () => {
        mockLookupIp.mockResolvedValue({
            ip: "5.6.7.8",
            city: "San Francisco",
            country: "US",
            hostname: "proxy.example.com",
            org: "Proxy Org"
        });

        const middleware = ipinfoCore({
            token: mockToken,
            ipSelector: originatingIPSelector
        });

        await middleware(mockReq, mockRes, next);

        expect(mockLookupIp).toHaveBeenCalledWith("5.6.7.8");
        expect(mockReq.ipinfo?.ip).toBe("5.6.7.8");
    });

    it("should use custom ipSelector function when provided", async () => {
        const customSelector = jest.fn().mockReturnValue("9.10.11.12");

        const middleware = ipinfoCore({
            token: mockToken,
            ipSelector: customSelector
        });

        await middleware(mockReq, mockRes, next);

        expect(customSelector).toHaveBeenCalledWith(mockReq);
        expect(mockLookupIp).toHaveBeenCalledWith("9.10.11.12");
    });

    it("should throw IPinfo API errors", async () => {
        const errorMessage = "API rate limit exceeded";
        mockLookupIp.mockRejectedValueOnce(new Error(errorMessage));
        const middleware = ipinfoCore({ token: mockToken });

        await expect(middleware(mockReq, mockRes, next)).rejects.toThrow(
            errorMessage
        );

        expect(mockReq.ipinfo).toBeUndefined();
        expect(next).not.toHaveBeenCalled();
    });
});
