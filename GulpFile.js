const { src, dest, parallel, watch } = require('gulp');
const sass = require('gulp-sass');
const cleanCSS = require('gulp-clean-css');

const rollup = require('rollup');
const nodeResolve = require('rollup-plugin-node-resolve');
const typescript = require('rollup-plugin-typescript');

sass.compiler = require('node-sass');

function css() {
    return src('./assets/src/scss/main.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(cleanCSS())
        .pipe(dest('./assets/dist/css/'));
}

function js() {
    return rollup
        .rollup({
            input: './assets/src/js//main.ts',
            plugins: [nodeResolve(), typescript({ target: 'es6' })],
        })
        .then((bundle) => {
            return bundle.write({
                file: './assets/dist/js/bundle.js',
                format: 'cjs',
            });
        });
}

function compile() {
    watch('./assets/src/scss/**/*.scss', css);
    watch('./assets/src/js/**/*.ts', js);
}

exports.css = css;
exports.js = js;
exports.compile = compile;
