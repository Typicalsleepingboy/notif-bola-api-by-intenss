const axios = require('axios');
const moment = require('moment');
const { JSDOM } = require('jsdom');

async function scrapeJadwal() {
    try {
        const url = 'https://www.goal.com/id/berita/jadwal-siaran-langsung-sepakbola/1qomojcjyge9n1nr2voxutdc1n';
        const { data } = await axios.get(url);
        const dom = new JSDOM(data);
        const document = dom.window.document;

        const tanggalElements = document.querySelectorAll('h3 strong');
        const rows = document.querySelectorAll('table tbody tr');

        let jadwal = [];
        let tanggalTerdekat = null;
        let tanggalTerdekatDiff = Infinity;

        tanggalElements.forEach((element) => {
            const tanggal = element.textContent.trim();
            const tanggalMoment = moment(tanggal, 'DD MMMM YYYY');

            const tanggalDiff = Math.abs(tanggalMoment.diff(moment(), 'days'));

            if (tanggalDiff < tanggalTerdekatDiff) {
                tanggalTerdekat = tanggal;
                tanggalTerdekatDiff = tanggalDiff;
            }
        });

        rows.forEach((element) => {
            const cells = element.querySelectorAll('td');
            if (cells.length >= 4) {
                const time = cells[0].textContent.trim();
                const match = cells[1].textContent.trim();
                const competition = cells[2].textContent.trim();
                const tvStation = cells[3].textContent.trim();

                jadwal.push({
                    time,
                    match,
                    competition,
                    tvStation
                });
            }
        });

        jadwal.sort((a, b) => moment(a.time, 'HH:mm').diff(moment(b.time, 'HH:mm')));

        return {
            status: 200,
            message: 'Berhasil mengambil jadwal',
            data: {
                date: tanggalTerdekat,
                schedule: jadwal[0] || {}
            }
        };
    } catch (error) {
        console.error('Error fetching schedule:', error.message);
        return {
            status: 500,
            message: 'Gagal mengambil jadwal',
            error: error.message
        };
    }
}

module.exports = {
    scrapeJadwal
};
