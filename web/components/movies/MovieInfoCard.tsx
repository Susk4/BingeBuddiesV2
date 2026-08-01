import React from "react";
import Image from "next/image";
import Button from "../ui/Button";
import Badge from "../ui/Badge";

const MovieInfoCard = ({
  movie,
  isLiked,
  handleLike,
}: {
  movie: { id: number; title?: string; poster_path?: string | null };
  isLiked: boolean;
  handleLike: (movie: { id: number }) => void;
}) => {
  const poster = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500/${movie.poster_path.replace(/^\//, "")}`
    : "";

  return (
    <article className="flex flex-col overflow-hidden rounded-md bg-surface-raised shadow-poster">
      <div className="relative aspect-[2/3] w-full bg-surface">
        {poster ? (
          <Image
            src={poster}
            alt={movie.title ?? "Movie"}
            fill
            className="object-cover"
            unoptimized
            sizes="(max-width: 640px) 50vw, 200px"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-xs text-ink-faint">
            No poster
          </div>
        )}
      </div>
      <div className="space-y-2 p-3">
        <h3 className="line-clamp-2 text-sm font-medium leading-snug text-ink">
          {movie.title}
        </h3>
        {isLiked ? (
          <Badge>In your list</Badge>
        ) : (
          <Button
            variant="success"
            fullWidth
            className="py-2 text-xs"
            onClick={() => handleLike(movie)}
          >
            + My list
          </Button>
        )}
      </div>
    </article>
  );
};

export default MovieInfoCard;
