const withMdx = require('@next/mdx')({
  options: {
    remarkPlugins: [],
    rehypePlugins: [],
    providerImportSource: "@mdx-js/react",
  }
});

const withRevealMDX = (nextConfig = {}) => {
  return Object.assign({
    pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx'],
    images: {
      loader: 'akamai',
      path: '/',
    },
    eslint: {
      // Warning: This allows production builds to successfully complete even if
      // your project has ESLint errors.
      ignoreDuringBuilds: true,
    },
  }, withMdx(nextConfig))
};

export default withRevealMDX;