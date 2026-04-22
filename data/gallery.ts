export const galleryImages = Array.from({ length: 9 }, (_, i) => ({
  src: `/gallery/photo-${i + 1}.jpg`,
  id: i + 1,
  portrait: (i + 1) % 3 === 0,
}))
