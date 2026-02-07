import type { Config } from 'jest'

process.env.TZ = process.env.TZ || 'UTC'

const esmModules = [
    'query-selector-shadow-dom',
    'react-syntax-highlighter',
    '@react-hook',
    '@medv',
    'monaco-editor',
    'mdast-util-find-and-replace',
    'escape-string-regexp',
    'unist-util-visit-parents',
    'unist-util-is',
    '@tiptap',
    'lowlight',
    'devlop',
    'hast-util-to-html',
    'html-void-elements',
    'property-information',
    'stringify-entities',
    'character-entities-html4',
    'character-entities-legacy',
    'ccount',
    'hast-util-whitespace',
    'space-separated-tokens',
    'comma-separated-tokens',
    'zwitch',
    '@posthog/hogql-parser',
]

// Shared configuration inherited by all test projects.
// Each project targets a different area of the frontend codebase so developers
// can run only the tests relevant to their changes (via --selectProjects).
const baseProjectConfig: Config = {
    clearMocks: true,
    testEnvironment: 'jsdom',
    testEnvironmentOptions: {},
    modulePaths: ['<rootDir>/'],
    moduleNameMapper: {
        '^.+\\.(css|less|scss|svg|png|lottie)$': '<rootDir>/src/test/mocks/styleMock.js',
        '^.+\\.sql\\?raw$': '<rootDir>/src/test/mocks/rawFileMock.js',
        '^~/(.*)$': '<rootDir>/src/$1',
        '^@posthog/lemon-ui(|/.*)$': '<rootDir>/@posthog/lemon-ui/src/$1',
        '^lib/(.*)$': '<rootDir>/src/lib/$1',
        'monaco-editor': '<rootDir>/node_modules/monaco-editor/esm/vs/editor/editor.api.d.ts',
        '^scenes/(.*)$': '<rootDir>/src/scenes/$1',
        '^products/(.*)$': '<rootDir>/../products/$1',
        '^common/(.*)$': '<rootDir>/../common/$1',
        '^@posthog/rrweb/es/rrweb': '@posthog/rrweb/dist/rrweb.min.js',
        d3: '<rootDir>/node_modules/d3/dist/d3.min.js',
        '^d3-(.*)$': `d3-$1/dist/d3-$1`,
    },
    setupFiles: ['<rootDir>/jest.setup.ts', 'fake-indexeddb/auto'],
    setupFilesAfterEnv: ['<rootDir>/jest.setupAfterEnv.ts', 'givens/setup', '<rootDir>/src/mocks/jest.ts'],
    transform: {
        '\\.[jt]sx?$': '@sucrase/jest-plugin',
    },
    transformIgnorePatterns: [`node_modules/(?!(?:.pnpm/)?(${esmModules.join('|')}))`],
    testPathIgnorePatterns: ['/node_modules/', '/services/mcp/'],
}

const config: Config = {
    coverageDirectory: 'coverage',
    coverageProvider: 'v8',

    // Test projects define clear boundaries so developers can run targeted subsets.
    //
    // Run all tests:           pnpm test
    // Run one project:         pnpm test:products   (or test:scenes, test:lib, etc.)
    // Run multiple projects:   pnpm jest --selectProjects scenes lib
    // Further filter by path:  pnpm jest --selectProjects scenes --testPathPattern session-recordings
    projects: [
        {
            ...baseProjectConfig,
            displayName: 'products',
            roots: ['<rootDir>/../products'],
        },
        {
            ...baseProjectConfig,
            displayName: 'scenes',
            roots: ['<rootDir>/src/scenes'],
        },
        {
            ...baseProjectConfig,
            displayName: 'lib',
            roots: ['<rootDir>/src/lib'],
        },
        {
            ...baseProjectConfig,
            displayName: 'queries',
            roots: ['<rootDir>/src/queries'],
        },
        {
            ...baseProjectConfig,
            displayName: 'toolbar',
            roots: ['<rootDir>/src/toolbar'],
        },
        {
            ...baseProjectConfig,
            displayName: 'core',
            roots: ['<rootDir>/src'],
            testPathIgnorePatterns: [
                '/node_modules/',
                '/services/mcp/',
                '<rootDir>/src/scenes/',
                '<rootDir>/src/lib/',
                '<rootDir>/src/queries/',
                '<rootDir>/src/toolbar/',
            ],
        },
    ],
}

export default config
