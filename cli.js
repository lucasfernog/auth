#!/usr/bin/env node

const request = require('request')
const clipboardy = require('clipboardy')

const api = require('./api.json')

const env = process.argv[2] || 'dev'

const url = api[env].url
if (!url) {
    console.error(`Env ${env} not found. Please check your api.json`)
    process.exit(1)
}

let postData = api[env].post
if (!postData) {
    console.error("Your env API object must have a 'post' property, containing the request data")
    process.exit(1)
}

request.post(url, postData, (error, response, body) => {
    if (error) {
        console.error(error)
        process.exit(1)
    }

    let data = JSON.parse(body)

    let token

    if (typeof data === 'string') {
        token = data
    } else {
        token = data[api[env].token_field || 'token']
        if (token == null) {
            console.error('Unable to parse token from response. Data:', data)
            process.exit(1)
        }
    }

    clipboardy.writeSync(token)
})