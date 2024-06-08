import eslint from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  { ignores: ['lib', 'node_modules'] },
  eslint.configs.recommended,
  {
    files: ['src/**/*.ts', 'test/**/*.ts'],
    extends: [...tseslint.configs.strict, ...tseslint.configs.stylistic],
  },
  {
    files: ['**/*.js', '**/*.ts'],
    languageOptions: { sourceType: 'module' },
    rules: {
      'no-var': 'error', // http://eslint.org/docs/rules/no-var
      'prefer-const': 'error', // http://eslint.org/docs/rules/prefer-const
      'no-use-before-define': ['error', 'nofunc'], // http://eslint.org/docs/rules/no-use-before-define

      /**
       * Possible errors
       */
      'no-cond-assign': ['error', 'always'], // http://eslint.org/docs/rules/no-cond-assign
      'no-console': 0, // http://eslint.org/docs/rules/no-console
      'no-alert': 'warn', // http://eslint.org/docs/rules/no-alert
      'no-extra-semi': 'error', // http://eslint.org/docs/rules/no-extra-semi
      'no-inner-declarations': 'error', // http://eslint.org/docs/rules/no-inner-declarations
      'block-scoped-var': 'error', // http://eslint.org/docs/rules/block-scoped-var

      /**
       * Best practices
       */
      'consistent-return': 'error', // http://eslint.org/docs/rules/consistent-return
      curly: ['error', 'multi-line'], // http://eslint.org/docs/rules/curly
      'default-case': 'error', // http://eslint.org/docs/rules/default-case
      'dot-notation': [
        'error',
        {
          // http://eslint.org/docs/rules/dot-notation
          allowKeywords: true,
        },
      ],
      eqeqeq: 'error', // http://eslint.org/docs/rules/eqeqeq
      'guard-for-in': 'error', // http://eslint.org/docs/rules/guard-for-in
      'no-caller': 'error', // http://eslint.org/docs/rules/no-caller
      'no-else-return': 'error', // http://eslint.org/docs/rules/no-else-return
      'no-eq-null': 'error', // http://eslint.org/docs/rules/no-eq-null
      'no-eval': 'error', // http://eslint.org/docs/rules/no-eval
      'no-extend-native': 'error', // http://eslint.org/docs/rules/no-extend-native
      'no-extra-bind': 'error', // http://eslint.org/docs/rules/no-extra-bind
      'no-fallthrough': 'error', // http://eslint.org/docs/rules/no-fallthrough
      'no-floating-decimal': 'error', // http://eslint.org/docs/rules/no-floating-decimal
      'no-implied-eval': 'error', // http://eslint.org/docs/rules/no-implied-eval
      'no-lone-blocks': 'error', // http://eslint.org/docs/rules/no-lone-blocks
      'no-loop-func': 'error', // http://eslint.org/docs/rules/no-loop-func
      'no-multi-str': 'error', // http://eslint.org/docs/rules/no-multi-str
      'no-native-reassign': 'error', // http://eslint.org/docs/rules/no-native-reassign
      'no-new': 'error', // http://eslint.org/docs/rules/no-new
      'no-new-func': 'error', // http://eslint.org/docs/rules/no-new-func
      'no-new-wrappers': 'error', // http://eslint.org/docs/rules/no-new-wrappers
      'no-octal': 'error', // http://eslint.org/docs/rules/no-octal
      'no-octal-escape': 'error', // http://eslint.org/docs/rules/no-octal-escape
      'no-param-reassign': 'error', // http://eslint.org/docs/rules/no-param-reassign
      'no-proto': 'error', // http://eslint.org/docs/rules/no-proto
      'no-redeclare': 'error', // http://eslint.org/docs/rules/no-redeclare
      'no-return-assign': 'error', // http://eslint.org/docs/rules/no-return-assign
      'no-script-url': 'error', // http://eslint.org/docs/rules/no-script-url
      'no-self-compare': 'error', // http://eslint.org/docs/rules/no-self-compare
      'no-sequences': 'error', // http://eslint.org/docs/rules/no-sequences
      'no-throw-literal': 'error', // http://eslint.org/docs/rules/no-throw-literal
      'no-with': 'error', // http://eslint.org/docs/rules/no-with
      radix: 'error', // http://eslint.org/docs/rules/radix
      'vars-on-top': 'error', // http://eslint.org/docs/rules/vars-on-top
      'wrap-iife': ['error', 'any'], // http://eslint.org/docs/rules/wrap-iife
      yoda: 'error', // http://eslint.org/docs/rules/yoda

      /**
       * Style
       */
      indent: ['error', 2], // http://eslint.org/docs/rules/indent
      'brace-style': [
        'error', // http://eslint.org/docs/rules/brace-style
        '1tbs',
        {
          allowSingleLine: true,
        },
      ],
      quotes: [
        'error',
        'single',
        'avoid-escape', // http://eslint.org/docs/rules/quotes
      ],
      camelcase: [
        'error',
        {
          // http://eslint.org/docs/rules/camelcase
          properties: 'never',
        },
      ],
      'comma-spacing': [
        'error',
        {
          // http://eslint.org/docs/rules/comma-spacing
          before: false,
          after: true,
        },
      ],
      'comma-style': ['error', 'last'], // http://eslint.org/docs/rules/comma-style
      'eol-last': 'error', // http://eslint.org/docs/rules/eol-last
      'func-names': 0, // http://eslint.org/docs/rules/func-names
      'key-spacing': [
        'error',
        {
          // http://eslint.org/docs/rules/key-spacing
          beforeColon: false,
          afterColon: true,
        },
      ],
      'new-cap': 0, // http://eslint.org/docs/rules/new-cap
      'no-multiple-empty-lines': [
        'error',
        {
          // http://eslint.org/docs/rules/no-multiple-empty-lines
          max: 2,
        },
      ],
      'no-nested-ternary': 'error', // http://eslint.org/docs/rules/no-nested-ternary
      'no-new-object': 'error', // http://eslint.org/docs/rules/no-new-object
      'no-spaced-func': 'error', // http://eslint.org/docs/rules/no-spaced-func
      'no-trailing-spaces': 'error', // http://eslint.org/docs/rules/no-trailing-spaces
      'no-extra-parens': ['error', 'functions'], // http://eslint.org/docs/rules/no-extra-parens
      'no-underscore-dangle': 0, // http://eslint.org/docs/rules/no-underscore-dangle
      'one-var': ['error', 'never'], // http://eslint.org/docs/rules/one-var
      'padded-blocks': ['error', 'never'], // http://eslint.org/docs/rules/padded-blocks
      semi: ['error', 'always'], // http://eslint.org/docs/rules/semi
      'semi-spacing': [
        'error',
        {
          // http://eslint.org/docs/rules/semi-spacing
          before: false,
          after: true,
        },
      ],
      'keyword-spacing': 'error', // http://eslint.org/docs/rules/space-after-keywords
      'space-before-blocks': 'error', // http://eslint.org/docs/rules/space-before-blocks
      'space-before-function-paren': [
        'error',
        { anonymous: 'always', named: 'never' },
      ], // http://eslint.org/docs/rules/space-before-function-paren
      'space-infix-ops': 'error', // http://eslint.org/docs/rules/space-infix-ops
      'spaced-comment': [
        'error',
        'always',
        {
          // http://eslint.org/docs/rules/spaced-comment
          exceptions: ['-', '+'],
          markers: ['=', '!'], // space here to support sprockets directives
        },
      ],
    },
  },
  {
    files: ['jest.config.js', 'spack.config.js'],
    languageOptions: { sourceType: 'commonjs', globals: { ...globals.node } },
  }
);
