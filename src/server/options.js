import packageJson from '../../package.json';

export default {
    packageJson,
    framework: 'melody',
    frameworkPresets: [require.resolve('./framework-preset-melody.js')],
};
