import { Hono } from "hono";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

const upload = new Hono().post("r2", async (c) => {
  try {
    const form = await c.req.formData();

    const file = form.get("file") as File;
    const s3 = new S3Client({
      region: "auto",
      endpoint: process.env.R2_BUCKET_URL!,
      credentials: {
        secretAccessKey: process.env.R2_SECRET_KEY!,
        accessKeyId: process.env.R2_ACCESS_KEY!,
      },
    });
    const imageFileDataArrayBuffer = await file.arrayBuffer();
    const imageFileDataBuffer = Buffer.from(imageFileDataArrayBuffer);
    const key = `images/${Date.now()}_${file.name}`;
    await s3.send(
      new PutObjectCommand({
        Bucket: "group-chat-app",
        Key: key,
        ContentType: file.type,
        Body: imageFileDataBuffer,
        ACL: "public-read",
      })
    );
    const uploadedUrl = `${process.env.R2_BUCKET_PUBLIC_URL}${key}`;
    return c.json(
      {
        success: true,
        message: "アップロードに成功しました。",
        url: uploadedUrl,
      },
      200
    );
  } catch (error) {
    console.error(error);
    return c.json(
      {
        success: false,
        message: "アップロードに失敗しました",
        url: null,
      },
      500
    );
  }
});

export default upload;
