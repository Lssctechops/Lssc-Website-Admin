export const getCloudinaryPublicId = (imageUrl) => {
  try {
    // Remove the file extension to get the public ID
    const publicId = imageUrl.slice(
      imageUrl.lastIndexOf("/") + 1,
      imageUrl.lastIndexOf("."),
    );

    return publicId;
  } catch (error) {
    console.error("Error extracting Cloudinary public ID:", error);
    return null; // Return null if extraction fails
  }
};