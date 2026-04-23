/** Chemins servis depuis `public/gallery/` (fichiers sources : dossier `gallery/` à la racine). */
const photoIds = [1, 2, 3, 4, 5, 6] as const

export const galleryImages = photoIds.map((id) => ({
  src: `/gallery/photo-${id}.jpg`,
  id,
  portrait: id % 3 === 0,
}))
