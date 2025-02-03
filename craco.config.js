const { CracoAliasPlugin } = require('react-app-alias-ex');

// eslint-disable-next-line no-undef
module.exports = {
  plugins: [
    {
      plugin: CracoAliasPlugin,
      options: {},
    },
  ],
  webpack: {
    configure: {
      ignoreWarnings: [
        function ignoreSourcemapsloaderWarnings(warning) {
          return (
            warning.module &&
            warning.module.resource.includes('node_modules') &&
            warning.details &&
            warning.details.includes('source-map-loader')
          );
        },

        // Ignore css conflict order warnings (this is not relevant whe using CSS modules)
        function ignoreCssConflictOrder(warning) {
          return warning.message?.includes('mini-css-extract-plugin');
        },
      ],
    },
  },
};
