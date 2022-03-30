const { v4: uuidv4 } = require('uuid');
const redisClient = require('./redis-client');
const validator = require('./validator');

module.exports.collect = async (req, res, next) => {
    if (process.env.VALIDATE_JSON_SCHEMA?.toLowerCase() === 'true') {
        const eventType = req.body.type;
        const validate = validator.getSchema(eventType);

        if (!validate(req.body.payload)) {
            res.status(422).json({ status: 'error', errors: validate.errors });
            return;
        }
    }

    const serverSide = req.body.payload.serverSide;

    // @TODO define server side metrics

    const uuid = uuidv4();
    const data = {
        uuid,
        eventType: req.body.type,
        ...req.body.payload
    };
    await redisClient.rPush(process.env.TRACKING_KEY, JSON.stringify(data));
    res.json({ status: 'success', uuid });
}