const fs = require('fs')
const path = require('path')

const mockBaseURL = 'http://note-server.hunger-valley.com'
const realBaseURL = 'http://note-server.hunger-valley.com'

exports.config = function ({isDev = true} = {isDev: true}) {
    let fileTex = `
        module.exports = {
            baseURL: '${isDev ? mockBaseURL : realBaseURL}'
        }
    `
    fs.writeFileSync(path.join(__dirname, '../src/helpers/config-baseURL.js'), fileTex)
}