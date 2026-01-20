import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: 'AG',
  tagline: 'Clarity over Articulation. Always.',
  favicon: 'img/eigenbytes-favicon.svg',

  // ✅ Enable Mermaid in Markdown
  markdown: {
    mermaid: true,
  },

  // ✅ Load Mermaid theme
  themes: ['@docusaurus/theme-mermaid'],

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },

  // Set the production url of your site here
  url: 'https://eigenbytes.com',
  // Set the /<baseUrl>/ pathname under which your site is served
  baseUrl: '/',

  // GitHub pages deployment config.
  organizationName: 'anubhab-codes',
  projectName: 'eigenbytes-site',

  onBrokenLinks: 'throw',

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: false, // ✅ disable default single docs instance
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  plugins: [
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'engineering',
        path: 'docs/engineering',
        routeBasePath: 'engineering',
        sidebarPath: require.resolve('./sidebarsEngineering.ts'),
      },
    ],
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'publications',
        path: 'docs/publications',
        routeBasePath: 'publications',
        sidebarPath: require.resolve('./sidebarsPublications.ts'),
      },
    ],
  ],

  themeConfig: {
    image: 'img/og-default-compressed.png',
    colorMode: {
      respectPrefersColorScheme: true,
    },

    navbar: {
      title: 'Home',
      items: [
        {to: '/engineering', label: 'Engineering', position: 'left'},
        {to: '/publications', label: 'Publications', position: 'left'},
        {to: '/resume', label: 'Resume', position: 'left'},
        {
          href: 'https://github.com/anubhab-codes',
          position: 'right',
          className: 'header-github-link',
        },
        {
          href: 'https://www.linkedin.com/in/anubhab-ghosh/',
          position: 'right',
          className: 'header-linkedin-link',
        },
      ],
    },

    footer: {
      style: 'dark',
      links: [
        {
          title: 'Site',
          items: [
            {label: 'Engineering', to: '/engineering'},
            {label: 'Publications', to: '/publications'},
            {label: 'Resume', to: '/resume'},
          ],
        },
        {
          title: 'More',
          items: [
            {label: 'GitHub', href: 'https://github.com/anubhab-codes'},
            {label: 'LinkedIn', href: 'https://www.linkedin.com/in/anubhab-ghosh/'},
            {label: 'Lichess', href: 'https://lichess.org/@/ravenclaw_x'},
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Anubhab Ghosh.`,
    },

    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;