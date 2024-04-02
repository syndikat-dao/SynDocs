import React from 'react'
import { DocsThemeConfig } from 'nextra-theme-docs'

const config: DocsThemeConfig = {
  logo: <img src="/logo.png" alt="Logo" width="50" height="25" />,
  project: {
    link: 'https://github.com/shuding/nextra-docs-template',
  },
  chat: {
    link: 'https://discord.com',
  },
  docsRepositoryBase: 'https://github.com/shuding/nextra-docs-template',
  footer: {
    text: <span>
      MIT {new Date().getFullYear()} ©{' '}
      <a href="https://opensource.org/license/mit" target="_blank">
        SyndikatDAO
      </a>
      
    </span>
  },
  banner: {
    key: '2.0-release',
      text: (
        <a href="https://nextra.site" target="_blank">
          Go Silly, or feel Silly! IDO is live now.
        </a>
      ),
  },  
}

export default config
