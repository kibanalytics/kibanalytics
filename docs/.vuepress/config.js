const { description } = require('../../package')

module.exports = {
    base: '/docs/',
    title: 'Kibanalytics',
    description: description,
    head: [
        ['meta', { name: 'theme-color', content: '#e8478b' }],
        ['meta', { name: 'apple-mobile-web-app-capable', content: 'yes' }],
        ['meta', { name: 'apple-mobile-web-app-status-bar-style', content: 'black' }]
    ],
    themeConfig: {
        sidebar: [
            '/',
            '/setup/',
            '/back-end-server/',
            '/front-end-tracker/',
            '/output-schema/',
            '/dashboard/'
        ]
    }
}