const cloudinary = require("../config/cloudinary");
const { Readable } = require("stream");

/**
 * Upload image to Cloudinary
 * @param {Buffer} fileBuffer - The file buffer from multer
 * @param {String} folder - The folder path in Cloudinary (optional)
 * @param {String} publicId - Custom public ID for the image (optional)
 * @returns {Promise<Object>} Cloudinary upload result
 */
const uploadToCloudinary = (
  fileBuffer,
  folder = "exercises",
  publicId = null
) => {
  return new Promise((resolve, reject) => {
    // Convert buffer to stream
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: folder,
        public_id: publicId,
        resource_type: "image",
        transformation: [
          { width: 800, height: 800, crop: "limit" }, // Resize if needed
          { quality: "auto" }, // Auto optimize quality
        ],
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    );

    // Create readable stream from buffer
    const readableStream = new Readable();
    readableStream.push(fileBuffer);
    readableStream.push(null);

    // Pipe to Cloudinary
    readableStream.pipe(stream);
  });
};

/**
 * Delete image from Cloudinary
 * @param {String} publicId - The public ID of the image to delete
 * @returns {Promise<Object>} Cloudinary deletion result
 */
const deleteFromCloudinary = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    throw error;
  }
};

/**
 * Extract public ID from Cloudinary URL
 * @param {String} url - Cloudinary URL
 * @returns {String} Public ID
 */
const extractPublicId = (url) => {
  if (!url) return null;

  try {
    // Extract public ID from URL
    // Format: https://res.cloudinary.com/{cloud_name}/image/upload/{version}/{folder}/{public_id}.{format}
    // or: https://res.cloudinary.com/{cloud_name}/image/upload/{folder}/{public_id}.{format}

    const urlParts = url.split("/");
    const uploadIndex = urlParts.findIndex((part) => part === "upload");

    if (uploadIndex === -1) return null;

    // Get everything after "upload"
    const afterUpload = urlParts.slice(uploadIndex + 1);

    // Remove version if present (format: v1234567890)
    const withoutVersion = afterUpload[0]?.startsWith("v")
      ? afterUpload.slice(1)
      : afterUpload;

    // Join and remove file extension
    const publicId = withoutVersion.join("/").replace(/\.[^/.]+$/, "");

    return publicId;
  } catch (error) {
    console.error("Error extracting public ID:", error);
    return null;
  }
};

module.exports = {
  uploadToCloudinary,
  deleteFromCloudinary,
  extractPublicId,
};
