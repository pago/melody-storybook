export async function webpack(config, { presets }) {
    const melodyPlugins = (await presets.apply('melodyPlugins')) || [];

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
                                plugins: ['idom', ...melodyPlugins],
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
