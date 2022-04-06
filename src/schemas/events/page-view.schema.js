module.exports = {
    type: 'object',
    properties: {
        referrer: { type: 'string' },
        platform: { type: 'string' },
        screen: { type: 'string' },
        language: { type: 'string' },
        adBlock: { type: 'boolean' },
        cookies: { type: 'boolean' }
    },
    required: [
        'referrer',
        'platform',
        'screen',
        'language',
        'adBlock',
        'cookies'
    ],
    additionalProperties: false
}