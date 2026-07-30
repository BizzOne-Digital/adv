import {
  v2 as cloudinary,
  type UploadApiErrorResponse,
  type UploadApiOptions,
  type UploadApiResponse,
} from "cloudinary";

function ensureCloudinaryConfigured(): void {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error(
      "Cloudinary is not configured. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET.",
    );
  }

  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true,
  });
}

export interface CloudinaryUploadResult {
  publicId: string;
  url: string;
  secureUrl: string;
  resourceType: string;
  format?: string;
  width?: number;
  height?: number;
  bytes?: number;
  folder?: string;
}

export interface CloudinaryUploadOptions {
  folder?: string;
  publicId?: string;
  resourceType?: "image" | "video" | "raw" | "auto";
  tags?: string[];
  overwrite?: boolean;
}

function mapUploadResponse(result: UploadApiResponse): CloudinaryUploadResult {
  return {
    publicId: result.public_id,
    url: result.url,
    secureUrl: result.secure_url,
    resourceType: result.resource_type,
    format: result.format,
    width: result.width,
    height: result.height,
    bytes: result.bytes,
    folder: result.folder,
  };
}

export async function uploadToCloudinary(
  file: string | Buffer,
  options: CloudinaryUploadOptions = {},
): Promise<CloudinaryUploadResult> {
  ensureCloudinaryConfigured();

  const uploadOptions: UploadApiOptions = {
    folder: options.folder ?? "cafbex",
    public_id: options.publicId,
    resource_type: options.resourceType ?? "auto",
    tags: options.tags,
    overwrite: options.overwrite ?? false,
  };

  if (Buffer.isBuffer(file)) {
    const result = await new Promise<UploadApiResponse>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        uploadOptions,
        (
          error: UploadApiErrorResponse | undefined,
          uploadResult: UploadApiResponse | undefined,
        ) => {
          if (error || !uploadResult) {
            reject(error ?? new Error("Cloudinary upload failed."));
            return;
          }
          resolve(uploadResult);
        },
      );
      stream.end(file);
    });

    return mapUploadResponse(result);
  }

  const result = await cloudinary.uploader.upload(file, uploadOptions);
  return mapUploadResponse(result);
}

export async function destroyCloudinaryAsset(
  publicId: string,
  resourceType: "image" | "video" | "raw" = "image",
): Promise<{ result: string }> {
  ensureCloudinaryConfigured();

  const response = await cloudinary.uploader.destroy(publicId, {
    resource_type: resourceType,
  });

  return { result: String(response.result ?? "ok") };
}

export { cloudinary };
