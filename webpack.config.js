const path = require('path');

const dev = {
    mode: 'development',
    devtool: 'source-map',
    watch: true,
    entry: {
        'tracker': path.resolve(__dirname, 'src/client/tracker.client.js')
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'public/dist'),
    }
};

const prod = {
    mode: 'production',
    devtool: false,
    watch: true,
    entry: {
        'tracker.min': path.resolve(__dirname, 'src/client/tracker.client.js')
    },
    module: {
        rules: [
            {
                test: /\.m?js$/,
                exclude: /(node_modules)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env'],
                        plugins: ['@babel/plugin-transform-runtime']
                    }
                }
            }
        ]
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'public/dist'),
    }
};

module.exports = env => {
    return (env.development) ? dev : prod;
};