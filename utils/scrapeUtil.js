const axios = require('axios');
const cheerio = require('cheerio');
const moment = require('moment'); 

async function scrapeJadwal() {
    const url = 'https://www.goal.com/id/berita/jadwal-siaran-langsung-sepakbola/1qomojcjyge9n1nr2voxutdc1n';
    
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);

    const tanggalElements = $('h3 strong');
    const rows = $('table tbody tr');

    let jadwal = [];
    let tanggalTerdekat = null;
    let tanggalTerdekatDiff = Infinity;

    tanggalElements.each((index, element) => {
        const tanggal = $(element).text().trim();
        const tanggalMoment = moment(tanggal, 'DD MMMM YYYY');

        const tanggalDiff = Math.abs(tanggalMoment.diff(moment(), 'days'));

        if (tanggalDiff < tanggalTerdekatDiff) {
            tanggalTerdekat = tanggal;
            tanggalTerdekatDiff = tanggalDiff;
        }
    });

    rows.each((index, element) => {
        const time = $(element).find('td').eq(0).text().trim();
        const match = $(element).find('td').eq(1).text().trim();
        const competition = $(element).find('td').eq(2).text().trim();
        const tvStation = $(element).find('td').eq(3).text().trim();

        const waktuMulai = moment(time, 'HH:mm');
        const waktuSekarang = moment();

        jadwal.push({
            time,
            match,
            competition,
            tvStation
        });
    });

    jadwal.sort((a, b) => a.waktuDiff - b.waktuDiff);

    return {
        date: tanggalTerdekat,
        schedule: jadwal[0]
    };
}

module.exports = {
    scrapeJadwal
}