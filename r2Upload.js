import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import fs from "fs";
import path from "path";

const r2 = new S3Client({
  region: "auto",
  endpoint: "https://619f0adad4f2dedf335c01846225b41d.r2.cloudflarestorage.com",
  credentials: {
    accessKeyId: "2604b337c2857a5439cee412164d8be4",
    secretAccessKey: "e5233280b58ae32b0622a9510016545584db0c36c12a51aff24113b636d7c146",
  },
});

async function uploadToR2() {
  const filePath = path.resolve("Assets/AccountLogo.svg");
  if (!fs.existsSync(filePath)) {
    console.error("Error: File does not exist:", filePath);
    return;
  }

  const fileStream = fs.createReadStream(filePath);
  const fileStats = fs.statSync(filePath);

  const params = {
    Bucket: "dream-movies-bucket", 
    Key: "AccountLogo.svg",
    Body: fileStream,
    ContentLength: fileStats.size, 
  };

  try {
    const data = await r2.send(new PutObjectCommand(params));
    console.log("Upload Success:", data);
  } catch (err) {
    console.error("Error uploading:", err);
  }
}

uploadToR2();
