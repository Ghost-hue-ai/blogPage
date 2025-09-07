import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

interface UploadOptions {
  folder?: string;
  resource_type?: "image" | "video" | "raw" | "auto";
}

export async function uploadOnCloudinary(
  file: File,
  options: UploadOptions = {}
) {
  const buffer = Buffer.from(await file.arrayBuffer());

  return new Promise<{ url: string; public_id: string }>((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          folder: options.folder || "default_uploads",
          resource_type: options.resource_type || "auto",
        },
        (err, result) => {
          if (err) return reject(err);
          resolve({
            url: result!.secure_url,
            public_id: result!.public_id,
          });
        }
      )
      .end(buffer);
  });
}
