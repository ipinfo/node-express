import { Request, Response, NextFunction } from "express";
import { ipinfoResproxy, originatingIPSelector } from "../src/index";
import { Resproxy } from "node-ipinfo/dist/src/common";

// Mock the node-ipinfo module
const mockLookupResproxy = jest.fn();
jest.mock("node-ipinfo", () => ({
    IPinfoWrapper: jest.fn().mockImplementation(() => ({
        lookupResproxy: mockLookupResproxy
    }))
}));

describe("ipinfoResproxyMiddleware", () => {
    const mockToken = "test_token";
    let mockReq: Partial<Request> & { ipinfo_resproxy?: Resproxy };
    let mockRes: Partial<Response>;
    let next: NextFunction;

    beforeEach(() => {
        // Reset mocks before each test
        jest.clearAllMocks();

        // Set up default mock response
        mockLookupResproxy.mockResolvedValue({
            ip: "175.107.211.204",
            last_seen: "2026-01-15",
            percent_days_seen: 100,
            service: "test_service"
        });

        // Setup mock request/response
        mockReq = {
            ip: "175.107.211.204",
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
        const middleware = ipinfoResproxy({ token: mockToken });

        await middleware(mockReq, mockRes, next);

        expect(mockLookupResproxy).toHaveBeenCalledWith("175.107.211.204");
        expect(mockReq.ipinfo_resproxy).toEqual({
            ip: "175.107.211.204",
            last_seen: "2026-01-15",
            percent_days_seen: 100,
            service: "test_service"
        });
        expect(next).toHaveBeenCalled();
    });

    it("should use originatingIPSelector when specified", async () => {
        mockLookupResproxy.mockResolvedValue({
            ip: "5.6.7.8",
            last_seen: "2026-01-15",
            percent_days_seen: 50,
            service: "proxy_service"
        });

        const middleware = ipinfoResproxy({
            token: mockToken,
            ipSelector: originatingIPSelector
        });

        await middleware(mockReq, mockRes, next);

        expect(mockLookupResproxy).toHaveBeenCalledWith("5.6.7.8");
        expect(mockReq.ipinfo_resproxy?.ip).toBe("5.6.7.8");
    });

    it("should use custom ipSelector function when provided", async () => {
        const customSelector = jest.fn().mockReturnValue("9.10.11.12");

        const middleware = ipinfoResproxy({
            token: mockToken,
            ipSelector: customSelector
        });

        await middleware(mockReq, mockRes, next);

        expect(customSelector).toHaveBeenCalledWith(mockReq);
        expect(mockLookupResproxy).toHaveBeenCalledWith("9.10.11.12");
    });

    it("should throw IPinfo API errors", async () => {
        const errorMessage = "API rate limit exceeded";
        mockLookupResproxy.mockRejectedValueOnce(new Error(errorMessage));
        const middleware = ipinfoResproxy({ token: mockToken });

        await expect(middleware(mockReq, mockRes, next)).rejects.toThrow(
            errorMessage
        );

        expect(mockReq.ipinfo_resproxy).toBeUndefined();
        expect(next).not.toHaveBeenCalled();
    });

    it("should pass through empty response when IP not in resproxy database", async () => {
        // Empty object simulates IP not in resproxy database
        mockLookupResproxy.mockResolvedValue({});

        const middleware = ipinfoResproxy({ token: mockToken });

        await middleware(mockReq, mockRes, next);

        expect(mockLookupResproxy).toHaveBeenCalledWith("175.107.211.204");
        expect(mockReq.ipinfo_resproxy).toEqual({});
        expect(next).toHaveBeenCalled();
    });
});
