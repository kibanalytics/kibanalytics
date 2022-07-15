module.exports = {
    type: 'object',
    properties: {
        foo: { type: 'string' },
        customEventsPayloadDev: {
            type: 'object',
            required: [],
            additionalProperties: true
        }
    },
    required: [],
    additionalProperties: false
}