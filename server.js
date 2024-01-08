import express from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;
app.use(express.json());

const books = [
  { id: 1, name: "Chí Phèo", author: "ABC" },
  { id: 2, name: "Thi No", author: "DEF" },
];

app.get("/books", authenToken, (req, res) => {
  console.log(req.body);
  res.json({ status: "Success", data: books });
});

function authenToken(req, res, next) {
  const authorizationHeader = req.headers["authorization"];
  console.log(authorizationHeader);
  //trả về dạng 'Beaer [token]'
  // Trả về dạng 'Bearer [token]'
  const token = authorizationHeader && authorizationHeader.split(" ")[1];
  console.log(33, token);

  if (!token) {
    return res.sendStatus(401);
  }
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, data) => {
    console.log(err, data);
    if (err) {
      res.sendStatus(403);
    }
    next();
  });
}

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
