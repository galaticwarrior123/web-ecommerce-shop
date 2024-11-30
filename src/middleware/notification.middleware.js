
export const gatewayMiddleware = (notificationGateway) => (req, res, next) => {
    req.notificationGateway = notificationGateway;
    next();
};