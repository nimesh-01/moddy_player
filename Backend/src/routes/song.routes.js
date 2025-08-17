const express = require('express')
const router = express.Router();
const multer = require('multer');
const uploadFile = require('../storage/Storage.service');
const songModel = require('../model/song.model')
const upload = multer({ storage: multer.memoryStorage() })
router.post('/songs', upload.single("audio"), async (req, res) => {
    console.log(req.body);
    console.log(req.file);
    const file = await uploadFile(req.file)
    const song = await songModel.create({
        title: req.body.title,
        artist: req.body.artist,
        audio: file.url,
        mood: req.body.mood,
    })
    console.log(file)
    res.status(201).json({
        message: "Song created successfully",
        song: song
    })
})
router.get('/songs', async (req, res) => {
    const { mood } = req.query
    const songs = await songModel.find({
        mood: mood
    })
    res.status(200).json({
       song: songs
    })
})

module.exports = router