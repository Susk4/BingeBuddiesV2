import Image from "next/image";
import Badge from "../ui/Badge";
import type { TmdbMovie } from "@binge-buddies/shared";

type MovieInfoProps = {
  item: TmdbMovie;
  variant?: "stacked" | "cover";
};

const MovieInfo = ({ item, variant = "stacked" }: MovieInfoProps) => {
  const {
    poster_path,
    title,
    overview,
    vote_average,
    release_date,
  } = item;

  const releaseYear = release_date?.split("-")[0] ?? "—";
  const posterSrc = poster_path
    ? `https://image.tmdb.org/t/p/w500/${poster_path.replace(/^\//, "")}`
    : null;

  if (variant === "cover") {
    return (
      <div className="relative min-h-0 flex-1 bg-surface-raised">
        {posterSrc ? (
          <Image
            src={posterSrc}
            fill
            unoptimized
            alt={title ?? "Movie"}
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 28rem"
            priority
          />
        ) : (
          <div className="flex h-full min-h-[12rem] items-center justify-center text-sm text-ink-faint">
            No poster
          </div>
        )}

        <div
          className="absolute inset-x-0 bottom-0 flex max-h-[55%] min-h-0 flex-col gap-2 bg-gradient-to-t from-black/95 via-black/75 to-transparent px-4 pb-4 pt-16 text-white md:px-5 md:pb-5"
        >
          <div className="space-y-2 shrink-0">
            <h2 className="font-sans text-xl font-semibold leading-tight tracking-tight md:text-2xl">
              {title}
            </h2>
            <div className="flex flex-wrap gap-2">
              <Badge className="border-white/20 bg-white/10 text-white">
                {releaseYear}
              </Badge>
              <Badge className="border-white/20 bg-white/10 text-white">
                {String(vote_average ?? "—")} / 10
              </Badge>
            </div>
          </div>
          <div className="bb-scrollbar-hidden min-h-0 overflow-y-auto overscroll-contain pr-1">
            {overview ? (
              <p className="text-sm leading-relaxed text-white/85 md:text-base">
                {overview}
              </p>
            ) : (
              <p className="text-sm text-white/60">No synopsis available.</p>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="relative aspect-[2/3] w-full shrink-0 bg-surface-raised">
        {posterSrc ? (
          <Image
            src={posterSrc}
            width={500}
            height={750}
            unoptimized
            alt={title ?? "Movie"}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full min-h-[280px] items-center justify-center text-sm text-ink-faint">
            No poster
          </div>
        )}
      </div>

      <div className="flex min-h-0 flex-1 flex-col gap-3 p-4 md:p-5">
        <div className="space-y-2">
          <h2 className="font-sans text-xl font-semibold tracking-tight text-ink md:text-2xl">
            {title}
          </h2>
          <div className="flex flex-wrap gap-2">
            <Badge>{releaseYear}</Badge>
            <Badge>{String(vote_average ?? "—")} / 10</Badge>
          </div>
        </div>
        {overview ? (
          <p className="line-clamp-6 text-sm leading-relaxed text-ink-muted md:line-clamp-5 md:text-base">
            {overview}
          </p>
        ) : (
          <p className="text-sm text-ink-faint">No synopsis available.</p>
        )}
      </div>
    </div>
  );
};

export default MovieInfo;
