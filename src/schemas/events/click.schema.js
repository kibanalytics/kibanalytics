module.exports = {
    type: 'object',
    properties: {
        class: {
            type: 'object',
            properties: {
                name: { type: 'string' },
                prefix: { type: 'string' },
                type: { type: 'string' },
                value: { type: 'string' }
            },
            required: [
                'name',
                'prefix',
                'type',
                'value',
            ],
            additionalProperties: false
        },
        element: {
            type: 'object',
            properties: {
                tagName: { type: 'string' }
            },
            required: ['tagName'],
            additionalProperties: false
        },
        foo: { type: 'string' }
    },
    required: [
        'class',
        'element'
    ],
    additionalProperties: false
}