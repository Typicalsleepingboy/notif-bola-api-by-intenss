const express = require('express');
const scrapeRoute = require('./route/scrapeRoute');
const { sendLogToDiscord } = require('./logger/discordlogger'); 

const app = express();
const PORT = process.env.PORT || 8000;

app.use('/intens/api', scrapeRoute);

app.get("/", (req, res) => {
  res.send({
    message: "Lu mau nyari apa?? mending join discord intens aja",
    author: "https://github.com/typicalsleepingboy",
    discord: "https://discord.gg/48intenscommunity",
  });
});

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
    sendLogToDiscord(`Server started on port ${PORT}`, "Info"); 
});
