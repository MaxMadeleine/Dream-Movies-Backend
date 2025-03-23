import { createClient } from "@supabase/supabase-js";

import dotenv  from "dotenv";
dotenv.config();

export const supabase = createClient(
    "https://qrsjogotplihbitfuuii.supabase.co/",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFyc2pvZ290cGxpaGJpdGZ1dWlpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIxMjc1OTIsImV4cCI6MjA1NzcwMzU5Mn0.6cf1jinIB0v78zDFRibkaTWY_N4p6bLqHKmi6c5nc2o"
);


//export const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);   