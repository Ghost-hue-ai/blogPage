import { NextResponse } from "next/server";
import cloudinary from "@/helper/cloudinary";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { error: "No file provided", success: false },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    const uploadResult = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          { folder: "blog_uploads", resource_type: "auto" },
          (err, result) => {
            if (err) reject(err);
            else resolve(result);
          }
        )
        .end(buffer); // ✅ directly send buffer
    });

    return NextResponse.json(
      {
        success: true,
        url: (uploadResult as any).secure_url,
        public_id: (uploadResult as any).public_id,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: error.message || "Upload failed", success: false },
      { status: 500 }
    );
  }
}
