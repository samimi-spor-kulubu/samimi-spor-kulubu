type Props = {
  /** Visible label, e.g. "Talha Numan UÇAR — fotoğraf yakında". */
  label?: string;
};

/**
 * Silhouette + soft gradient shown in place of a trainer photo when
 * the `photo` column is null. Stays inside the parent's aspect box so
 * cards on /egitmenler and the hero on /egitmenler/[slug] keep the
 * same dimensions whether or not a photo exists.
 */
export function TrainerPhotoPlaceholder({label}: Props) {
  return (
    <div
      className="flex h-full w-full items-center justify-center bg-gradient-to-br from-zinc-200 to-zinc-300"
      role="img"
      aria-label={label ?? 'Eğitmen fotoğrafı yakında'}
    >
      <svg
        viewBox="0 0 64 64"
        fill="none"
        aria-hidden="true"
        className="h-1/2 w-1/2 max-h-40 max-w-40 text-zinc-400"
      >
        <circle cx="32" cy="24" r="12" fill="currentColor" />
        <path
          d="M10 56c0-12 10-20 22-20s22 8 22 20"
          fill="currentColor"
        />
      </svg>
    </div>
  );
}
