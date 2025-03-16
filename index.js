//npm i @supabase/supabase-js
//npm i dotenv
//npm i nodemon
//npm i express
//npm init
//npm i node
//npm i cors

import express from "express";
import dotenv from "dotenv";
import cors from "cors";
dotenv.config();

const port = process.env.PORT || 4000;
const app = express();

app.use(cors());

app.use(cors({
    origin: 'http://127.0.0.1:5500',  // Your frontend URL
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type']
}));



app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("velkommen");
});

// app.use((err, req, res, next) => {
//   if (err.constraint === 'genres_pkey') {
//     return res.status(409).json({
//       error: 'A genre with this ID already exists'
//     });
//   }
//   console.error(err);
//   res.status(500).json({
//     error: 'Internal server error'
//   });
// });


app.listen(port, () => {
  console.log(`
      Express kører på port: ${port}   
      http://localhost:${port}/
      http://localhost:${port}/posters
      http://localhost:${port}/genres
    `);
});


