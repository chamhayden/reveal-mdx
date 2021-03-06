import resolve from '@rollup/plugin-node-resolve';
import styles from "rollup-plugin-styles";
const autoprefixer = require('autoprefixer');
import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import sourcemaps from 'rollup-plugin-sourcemaps';
//import typescript from '@rollup/plugin-typescript';
import { nodeResolve } from '@rollup/plugin-node-resolve';

// the entry point for the library
const input = 'index.js'

// 
var MODE = [
  {
    fomart: 'cjs'
  },
  {
    fomart: 'esm'
  },
  {
    fomart: 'umd'
  }
]




var config = []


MODE.map((m) => {
    var conf = {
        input: input,
        output: {
            // then name of your package
            name: "reveal-mdx",
            dir: `dist/`,
            format: m.fomart,
            exports: "auto",
            sourcemap: true,
            inlineDynamicImports: true,
        },
        // this externelizes react to prevent rollup from compiling it
        external: [
            "react",
            /@babel\/runtime/
        ],
        plugins: [
            resolve({
                extensions: [".js", ".jsx", ".ts", ".tsx"],
            }),
            // these are babel comfigurations
            babel({
                exclude: ['node_modules/**'],
                plugins: ['@babel/transform-runtime'],
                babelHelpers: 'runtime'
            }),
            // this adds sourcemaps
            commonjs(),
            sourcemaps(),
            // this adds support for styles
            styles({
                postcss: {
                    plugins: [
                        autoprefixer()
                    ]
                }
            }),
            //typescript(),
            nodeResolve(),
        ],
    }
    config.push(conf)
})

export default [
  ...config,
]
