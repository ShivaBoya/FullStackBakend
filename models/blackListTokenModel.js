const express = require("express")
const { default: mongoose } = require("mongoose")


const blackListTokenScema = new mongoose.Schema({
    token:String
})


const blackListTokenModel = mongoose.model("BlackListToken",blackListTokenScema)

module.exports = blackListTokenModel