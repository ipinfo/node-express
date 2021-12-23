const express = require("express");
const ipinfo = require("ipinfo-express");

const app = express();

app.use(
    ipinfo({
        token: process.env.IPINFO_TOKEN,
        cache: null,
        timeout: 5000
    })
);

app.get("/", function (req, res) {
    res.send(req.ipinfo);
});

app.listen(3000, () => {
    console.log(`Server is running`);
});
