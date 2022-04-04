module.exports = {
    type: 'object',
    properties: {
        type: { type: 'string' },
        metrics: {
            type: 'object',
            properties: {}, required: []
        },
        payload: { typeof: 'object' },
    },
    required: [
        'type',
        'payload'
    ],
    additionalProperties: false
}