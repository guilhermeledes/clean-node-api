/* eslint-disable indent */
/* eslint-disable eol-last */
module.exports = {
    mongodbMemoryServerOptions: {
        binary: {
            version: '4.2.2',
            skipMD5: true
        },
        autoStart: false,
        instance: {
            dbName: 'jest'
        }
    }
}