import { MDXProvider } from '@mdx-js/react'
import { RevealNext } from 'reveal-react';

const RevealMdx = ({ children, options }) => {
  return (
    <MDXProvider components={options.mdx.components}>
      <RevealNext options={options.reveal}>
        {children}
      </RevealNext>
    </MDXProvider>
  )
}

export default RevealMdx;
