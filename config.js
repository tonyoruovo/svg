const o = {
    port: 1010,
    files: ["./src/**/*.{html,htm,css,js,svg}"],
    watchOptions: {
        ignored: 'node_modules'
    },
    startPath: "./svg.html",
    server: {
        baseDir: "./src",
        index: "./svg.html"
    }
}
module.exports = o;