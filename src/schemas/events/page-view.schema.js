module.exports = {
    type: 'object',
    properties: {
        tracker_id: { type: 'string' },
        hostname: { type: 'string' },
        url: { type: 'string' },
        referrer: { type: 'string' },
        platform: { type: 'string' },
        screen: { type: 'string' },
        language: { type: 'string' },
        adBlock: { type: 'boolean' },
        cookies: { type: 'boolean' }
    },
    required: [
        'tracker_id',
        'hostname',
        'url',
        'referrer',
        'platform',
        'screen',
        'language',
        'adBlock',
        'cookies'
    ],
    additionalProperties: false
}