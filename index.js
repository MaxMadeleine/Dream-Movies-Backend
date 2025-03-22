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
import { supabase } from "./Utils/supabaseClient.js"; // Import the Supabase client

dotenv.config();

const port = process.env.PORT || 4000;
const app = express();

app.use(cors());

app.use(cors({
    origin: ['http://127.0.0.1:5173', 'http://localhost:5173'],  // Allow both frontend URLs
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type']
}));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("velkommen");
});

const router = express.Router();

app.get(`/posters`, async (req, res) => {
    const { data, error } = await supabase
        .from('posters')
        .select('*');

    if (error) {
        return res.status(500).json({ error: error.message });
    }

    res.json(data);
});

app.get(`/posters/:id`, async (req, res) => {
    const posterId = req.params.id;
    const { data, error } = await supabase
        .from('posters')
        .select('*')
        .eq('id', posterId);


    if (error) {
        return res.status(500).json({ error: error.message });
    }

    res.json(data);
});

app.delete(`/posters/:id`, async (req, res) => {
    const posterId = req.params.id;
    try {
        const { error: relError } = await supabase
            .from('genre_poster_rel')
            .delete()
            .eq('poster_id', posterId);

        if (relError) {
            console.error("Error deleting related records:", relError);
            return res.status(500).json({ error: relError.message });
        }

        const { data, error } = await supabase
            .from('posters')
            .delete()
            .eq('id', posterId);

        if (error) {
            console.error("Error deleting poster:", error);
            return res.status(500).json({ error: error.message });
        }

        res.json({ message: "Poster has been deleted successfully", data });
    } catch (err) {
        console.error("Unexpected error:", err);
        res.status(500).json({ error: "Unexpected error occurred" });
    }
});

app.put(`/posters/:id`, async (req, res) => {
    const posterId = req.params.id;
    const { name, description, image_url, width, height, price, stock } = req.body;
    try {

        const { data, error } = await supabase
            .from('posters')
            .update({ name, description, image_url, width, height, price, stock,
             })
            .eq('id', posterId);

        if (error) {
            console.error("Error updateing poster:", error);
            return res.status(500).json({ error: error.message });
        }

        res.json({ message: "Poster has been updated successfully", data });
    } catch (err) {
        console.error("Unexpected error:", err);
        res.status(500).json({ error: "Unexpected error occurred" });
    }
});

app.post(`/posters`, async (req, res) => {
    const { name, description, image_url, width, height, price, stock, genre_id } = req.body;
    console.log("Request body:", req.body); // Log the request body for debugging
    try {
        // Insert the new poster
        const { data: posterData, error: posterError } = await supabase
            .from('posters')
            .insert([{ name, description, image_url, width, height, price, stock }])
            .select();

        if (posterError) {
            console.error("Error adding poster:", posterError);
            return res.status(500).json({ error: posterError.message });
        }

        // Get the inserted poster's ID
        const posterId = posterData[0].id;

        // Insert the relationship into the genre_poster_rel table
        const { error: relError } = await supabase
            .from('genre_poster_rel')
            .insert([{ poster_id: posterId, genre_id }]);

        if (relError) {
            console.error("Error adding genre relationship:", relError);
            return res.status(500).json({ error: relError.message });
        }

        res.json({ message: "Poster has been added successfully", posterData });
    } catch (err) {
        console.error("Unexpected error:", err);
        res.status(500).json({ error: "Unexpected error occurred" });
    }
});


app.listen(port, () => {
  console.log(`
      Express kører på port: ${port}   
      http://localhost:${port}/
      http://localhost:${port}/posters
      http://localhost:${port}/genres
    `);
});