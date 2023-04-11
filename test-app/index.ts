import express from 'express';
import ipinfo from "ipinfo-express";

const app = express();
const port = 3000;

app.use(
  ipinfo({
    token: "e701429c12dd94",
    cache: null,
    timeout: 5000
  })
);

app.get("/", function (req: any, res: any) {
  res.send(req.ipinfo);
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
