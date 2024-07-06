import nextra from 'nextra';

const withNextra = nextra({
  theme: 'nextra-theme-docs',
  themeConfig: './theme.config.tsx',
});

export default withNextra({
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: '/',
        destination: '/who?',
        permanent: false,
      },
    ];
  },
});

//   env: {
//     JWT_SECRET: process.env.JWT_SECRET,
//     NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
//   },
// });
