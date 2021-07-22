module.exports = {
  webpack: (config, { webpack }) => {
    config.plugins.push(new webpack.ContextReplacementPlugin(/eslint/));

    return config;
  },
};
