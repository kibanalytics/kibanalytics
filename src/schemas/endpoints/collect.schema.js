module.exports = {
    type: 'object',
    properties: {
        tracker_id: { type: 'string' },
        hostname: { type: 'string' },
        url: { type: 'string' },
        type: { type: 'string' },
        serverSide: {
            type: 'object',
            properties: {
                foo: { type: 'string' }
            },
            required: [],
            additionalProperties: false
        },
        payload: { typeof: 'object' },
    },
    required: [
        'tracker_id',
        'hostname',
        'url',
        'type',
        'serverSide',
        'payload'
    ],
    additionalProperties: false
}