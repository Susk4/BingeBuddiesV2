import { useVirtualizer } from "@tanstack/react-virtual";
import type { RefObject } from "react";
import type { TmdbMovie } from "@binge-buddies/shared";
import MovieInfoCard from "./MovieInfoCard";

const GRID_ROW_ESTIMATE = 380;

type VirtualMovieGridProps = {
  movies: TmdbMovie[];
  columns: number;
  scrollElementRef: RefObject<HTMLElement | null>;
  isLiked: (movie: TmdbMovie) => boolean;
  handleLike: (movie: TmdbMovie) => void;
};

const VirtualMovieGrid = ({
  movies,
  columns,
  scrollElementRef,
  isLiked,
  handleLike,
}: VirtualMovieGridProps) => {
  const rowCount = Math.ceil(movies.length / columns);

  const virtualizer = useVirtualizer({
    count: rowCount,
    getScrollElement: () => scrollElementRef.current,
    estimateSize: () => GRID_ROW_ESTIMATE,
    overscan: 2,
    measureElement: (element) => element.getBoundingClientRect().height,
  });

  return (
    <div
      className="relative w-full"
      style={{ height: `${virtualizer.getTotalSize()}px` }}
    >
      {virtualizer.getVirtualItems().map((virtualRow) => {
        const startIndex = virtualRow.index * columns;
        const rowMovies = movies.slice(startIndex, startIndex + columns);

        return (
          <div
            key={virtualRow.key}
            data-index={virtualRow.index}
            ref={virtualizer.measureElement}
            className="absolute left-0 top-0 w-full pb-6"
            style={{
              transform: `translateY(${virtualRow.start}px)`,
            }}
          >
            <div
              className="grid gap-6"
              style={{
                gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
              }}
            >
              {rowMovies.map((movie) => (
                <MovieInfoCard
                  key={movie.id}
                  movie={movie}
                  isLiked={isLiked(movie)}
                  handleLike={handleLike}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default VirtualMovieGrid;
