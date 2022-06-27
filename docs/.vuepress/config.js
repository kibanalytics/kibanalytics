const {
    description
} = require('../../package');

let nav = [{
    text: 'Home',
    link: '/README.md',
    children: [{
        text: 'Quick Intro',
        link: '/introduction.md'
    }]
},
    {
        text: 'Setup',
        link: '/setup/'
    },
    {
        text: 'Backend Server',
        link: '/back-end-server/'
    },
    {
        text: 'Frontend Tracker',
        link: '/front-end-tracker/'
    },
    {
        text: 'Output Schema',
        link: '/output-schema/'
    },
    {
        text: 'Dashboard',
        link: '/dashboard/'
    }
];

module.exports = {
    title: 'Kibanalytics',
    description: description,
    head: [
        ['meta', { name: 'theme-color', content: '#e8478b' }],
        ['meta', { name: 'apple-mobile-web-app-capable', content: 'yes' }],
        ['meta', { name: 'apple-mobile-web-app-status-bar-style', content: 'black' }]
    ],
    themeConfig: {
        repo: 'https://github.com/kibanalytics/kibanalytics',
        repoLabel: 'Github Repo',
        navbar: nav,
        sidebar: nav
    }
}
