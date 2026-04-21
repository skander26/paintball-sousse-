/** Static paths — client can add real files under /public/gallery/ */
export const galleryImages = Array.from({ length: 9 }, (_, i) => ({
  src: `/gallery/photo-${i + 1}.jpg`,
  alt: `Paintball Sousse action shot ${i + 1}`,
}));

export const GALLERY_IMAGE_FALLBACK = "/gallery/placeholder.svg";
