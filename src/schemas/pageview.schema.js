module.exports = {
    type: 'object',
    properties: {
        website: { type: 'string' },
        hostname: { type: 'string' },
        url: { type: 'string' },
        referrer: { type: 'string' },
        screen: { type: 'string' },
        language: { type: 'string' },
        cache: { type: 'string' }
    },
    required: [
        'website',
        'hostname',
        'url',
        'referrer',
        'language',
        'screen'
    ],
    additionalProperties: false
}