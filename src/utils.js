module.exports.getServerMetric = (req) => {
    const serverMetrics = {
        sessionId: req.sessionID
    };

    return serverMetrics;
}