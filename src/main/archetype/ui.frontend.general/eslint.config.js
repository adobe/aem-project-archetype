module.exports = import('@aemforms/eslint-plugin').then(({ default: forms }) => [
    {
        ignores: [
            '**/node_modules/**',
            '**/target/**',
            '**/dist/**',
            '**/*.bundle.js',
            'ui.apps/src/main/content/jcr_root/apps/${appId}/clientlibs/clientlib-site/**',
            'ui.apps/src/main/content/jcr_root/apps/${appId}/clientlibs/clientlib-dependencies/**'
        ]
    },
    {
        files: [
            'ui.frontend/src/**/*.js',
            'ui.apps*/src/main/content/jcr_root/apps/**/*.js'
        ],
        languageOptions: {
            ecmaVersion: 'latest',
            sourceType: 'module',
            parserOptions: {
                ecmaFeatures: {
                    jsx: true
                }
            }
        },
        plugins: {
            '@aemforms': forms
        },
        rules: {
            '@aemforms/custom-fn-correctness': 'warn'
        }
    }
]);
