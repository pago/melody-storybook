export function webpack(config) {
    return {
        ...config,
        module: {
            ...config.module,
            rules: [
                ...config.module.rules,
                {
                    test: /\.twig$/,
                    use: [
                        'babel-loader',
                        {
                            loader: require.resolve('melody-loader'),
                            options: {
                                plugins: ['idom'],
                            },
                        },
                    ],
                },
            ],
        },
        resolve: {
            ...config.resolve,
            extensions: [...config.resolve.extensions, '.twig'],
        },
    };
}
