import { supabase } from "./Utils/supabaseClient.js"; // Import the Supabase client

export default {
  async fetch(req, env, ctx) {
    const url = new URL(req.url);
    const path = url.pathname;

    if (path === "/") {
      return new Response("velkommen", { status: 200 });
    } else if (path.startsWith("/posters")) {
      const id = path.split("/")[2];
      if (req.method === "GET") {
        if (id) {
          // Get poster by ID
          const { data, error } = await supabase
            .from("posters")
            .select("*")
            .eq("id", id);
          if (error) {
            return new Response(JSON.stringify({ error: error.message }), {
              status: 500,
              headers: { "Content-Type": "application/json" },
            });
          }
          return new Response(JSON.stringify(data), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          });
        } else {
          // Get all posters
          const { data, error } = await supabase.from("posters").select("*");
          if (error) {
            return new Response(JSON.stringify({ error: error.message }), {
              status: 500,
              headers: { "Content-Type": "application/json" },
            });
          }
          return new Response(JSON.stringify(data), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          });
        }
      } else if (req.method === "DELETE" && id) {
        // Delete poster by ID
        try {
          const { error: relError } = await supabase
            .from("genre_poster_rel")
            .delete()
            .eq("poster_id", id);
          if (relError) {
            return new Response(
              JSON.stringify({ error: relError.message }),
              {
                status: 500,
                headers: { "Content-Type": "application/json" },
              }
            );
          }
          const { data, error } = await supabase
            .from("posters")
            .delete()
            .eq("id", id);
          if (error) {
            return new Response(
              JSON.stringify({ error: error.message }),
              {
                status: 500,
                headers: { "Content-Type": "application/json" },
              }
            );
          }
          return new Response(
            JSON.stringify({ message: "Poster has been deleted successfully", data }),
            {
              status: 200,
              headers: { "Content-Type": "application/json" },
            }
          );
        } catch (err) {
          return new Response(
            JSON.stringify({ error: "Unexpected error occurred" }),
            {
              status: 500,
              headers: { "Content-Type": "application/json" },
            }
          );
        }
      } else if (req.method === "PUT" && id) {
        // Update poster by ID
        const { name, description, image_url, width, height, price, stock } = await req.json();
        try {
          const { data, error } = await supabase
            .from("posters")
            .update({ name, description, image_url, width, height, price, stock })
            .eq("id", id);
          if (error) {
            return new Response(
              JSON.stringify({ error: error.message }),
              {
                status: 500,
                headers: { "Content-Type": "application/json" },
              }
            );
          }
          return new Response(
            JSON.stringify({ message: "Poster has been updated successfully", data }),
            {
              status: 200,
              headers: { "Content-Type": "application/json" },
            }
          );
        } catch (err) {
          return new Response(
            JSON.stringify({ error: "Unexpected error occurred" }),
            {
              status: 500,
              headers: { "Content-Type": "application/json" },
            }
          );
        }
      } else if (req.method === "POST") {
        // Create new poster
        const { name, description, image_url, width, height, price, stock, genre_id } = await req.json();
        try {
          const { data: posterData, error: posterError } = await supabase
            .from("posters")
            .insert([{ name, description, image_url, width, height, price, stock }])
            .select();
          if (posterError) {
            return new Response(
              JSON.stringify({ error: posterError.message }),
              {
                status: 500,
                headers: { "Content-Type": "application/json" },
              }
            );
          }
          const posterId = posterData[0].id;
          const { error: relError } = await supabase
            .from("genre_poster_rel")
            .insert([{ poster_id: posterId, genre_id }]);
          if (relError) {
            return new Response(
              JSON.stringify({ error: relError.message }),
              {
                status: 500,
                headers: { "Content-Type": "application/json" },
              }
            );
          }
          return new Response(
            JSON.stringify({ message: "Poster has been added successfully", posterData }),
            {
              status: 200,
              headers: { "Content-Type": "application/json" },
            }
          );
        } catch (err) {
          return new Response(
            JSON.stringify({ error: "Unexpected error occurred" }),
            {
              status: 500,
              headers: { "Content-Type": "application/json" },
            }
          );
        }
      }
    }
    return new Response("Not Found", { status: 404 });
  },
};