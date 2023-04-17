module.exports = {
    type: 'object',
    properties: {
        url: {
            type: 'object',
            properties: {
                href: { type: 'string' }
            },
            required: ['href'],
            additionalProperties: false
        },
        referrer: { type: 'string' },
        event: {
            type: 'object',
            properties: {
                ts: {
                    type: 'object',
                    properties: {
                        started: { type: 'number' },
                        scriptEventStartedDelta: { type: 'number' }
                    },
                    required: [
                        'started',
                        'scriptEventStartedDelta'
                    ]
                },
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
                viewport: {
                    type: 'object',
                    properties: {
                        width: { type: 'number' },
                        height: { type: 'number' }
                    },
                    required: ['width', 'height'],
                    additionalProperties: false
                },
                adblock: { type: 'boolean' },
                cookies: { type: 'boolean' }
            },
            required: [
                'language',
                'adblock',
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
            additionalProperties: true
        }
    },
    required: [
        'url',
        'referrer',
        'event',
        'device',
        'browser',
        'serverSide'
    ],
    additionalProperties: false
}