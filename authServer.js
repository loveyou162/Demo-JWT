import express from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
const app = express();
const PORT = 5500;
app.use(express.json());

let refreshTokenData = [];

app.post("/refreshToken", (req, res) => {
  const refreshToken = req.body.token;
  if (!refreshToken) res.sendStatus(401);
  if (refreshTokenData.includes(refreshToken)) res.sendStatus(403);
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, data) => {
    console.log(err, data);
    if (err) {
      res.sendStatus(403);
    } else {
      const accessToken = jwt.sign(
        { usename: data.username },
        process.env.ACCESS_TOKEN_SECRET,
        {
          expires: "60s",
        }
      );
    }
    res.json({ accessToken });
  });
});

app.post("/login", (req, res) => {
  //Authorization
  const data = req.body;
  console.log({ data });
  const accessToken = jwt.sign(data, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "360s",
  });
  const refreshToken = jwt.sign(data, process.env.REFRESH_TOKEN_SECRET);
  refreshTokenData.push(refreshToken);
  res.json({ accessToken, refreshToken });
});

app.post("/logout", (req, res) => {
  const refreshToken = req.body.token;
  refreshTokenData = refreshTokenData.filter(
    (refToken) => refToken !== refreshToken
  );
  res.sendStatus(200);
});

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
