import { MDXProvider } from '@mdx-js/react'
import withRevealMDX from './src/with-reveal-mdx';
//import RevealMdx from './src/RevealMdx';

module.exports = {
	withRevealMDX: withRevealMDX,
	RevealMdxProvider: MDXProvider,
	//RevealMdx: RevealMdx,
}
