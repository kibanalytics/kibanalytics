const { v4: uuidv4 } = require('uuid');
const redisClient = require('./redis-client');
const validator = require('./validator');
const { getServerMetric } = require('./utils');

module.exports.collect = async (req, res, next) => {
    try {
        if (process.env.VALIDATE_JSON_SCHEMA?.toLowerCase() === 'true') {
            const eventType = req.body.type;
            const validate = validator.getSchema(eventType);

            if (!validate(req.body.payload)) {
                res.status(422).json({ status: 'error', message: 'Schema validation error', errors: validate.errors });
                return;
            }
        }

        const serverMetrics = getServerMetric(req);
        const data = {
            uuid: uuidv4(),
            eventType: req.body.type,
            ...req.body.payload,
            ... serverMetrics
        };

        // @TODO rPush nested objects
        await redisClient.rPush(process.env.TRACKING_KEY, JSON.stringify(data));
        res.json({ status: 'success', uuid: data.uuid });
    } catch (err) {
        next(err);
    }
}