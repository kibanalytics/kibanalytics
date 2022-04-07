module.exports = {
    type: 'object',
    properties: {
        tracker_id: { type: 'string' },
        url: {
            type: 'object',
            properties: {
                href: { type: 'string' },
                referrer: { type: 'string' }
            },
            required: ['href'],
            additionalProperties: false
        },
        event: {
            type: 'object',
            properties: {
                type: { type: 'string' },
                payload: { typeof: 'object' }
            },
            required: ['type'],
            additionalProperties: false
        },
        device: {
            type: 'object',
            properties: {
                platform: { type: 'string' },
                screen: {
                    type: 'object',
                    properties: {
                        width: { type: 'number' },
                        height: { type: 'number' }
                    },
                    required: ['width', 'height'],
                    additionalProperties: false
                },
            },
            required: [],
            additionalProperties: false
        },
        browser: {
            type: 'object',
            properties: {
                language: { type: 'string' },
                adBlock: { type: 'boolean' },
                cookies: { type: 'boolean' }
            },
            required: [
                'language',
                'adBlock',
                'cookies'
            ],
            additionalProperties: false
        },
        serverSide: {
            type: 'object',
            properties: {
                foo: { type: 'string' }
            },
            required: [],
            additionalProperties: false
        }
    },
    required: [
        'tracker_id',
        'url',
        'event',
        'device',
        'browser',
        'serverSide'
    ],
    additionalProperties: false
}