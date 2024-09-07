const express = require('express');
const { scrapeJadwal } = require('../utils/scrapeUtil');
const { sendLogToDiscord } = require('../logger/discordlogger'); 

const router = express.Router();

router.get('/jadwalbola', async (req, res) => {
    try {
        const jadwalData = await scrapeJadwal();
        await sendLogToDiscord('Jadwal bola berhasil di-scrape dan dikirimkan ke user.', 'Info', {
            method: req.method,
            url: req.originalUrl,
            responseTime: 'N/A',
        });
        res.json(jadwalData);
    } catch (error) {
        console.error(error);
        await sendLogToDiscord(`Error saat mencoba scrape jadwal bola: ${error.message}`, 'Error', {
            method: req.method,
            url: req.originalUrl,
            responseTime: 'N/A',
        });
        res.status(500).json({ message: 'Something went wrong!' });
    }
});

module.exports = router;
