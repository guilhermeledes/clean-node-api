/* eslint-disable indent */
/* eslint-disable eol-last */
module.exports = {
    mongodbMemoryServerOptions: {
        binary: {
            version: '3.0.15',
            skipMD5: true
        },
        autoStart: false,
        instance: {
            dbName: 'jest'
        }
    }
}