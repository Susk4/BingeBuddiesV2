const getTmdbCredentials = (): {
  bearer?: string;
  apiKey?: string;
} => {
  const key = process.env.TMDB_KEY?.trim();
  const token = process.env.TMDB_TOKEN?.trim();

  if (key) {
    return { apiKey: key, bearer: token?.includes(".") ? token : undefined };
  }
  if (token && token.includes(".")) {
    return { bearer: token };
  }
  if (token) {
    return { apiKey: token };
  }
  throw new Error("Missing TMDB_KEY or TMDB_TOKEN");
};

export const tmdbApiGet = async <T>(
  path: string,
  query: Record<string, string | number | undefined> = {},
): Promise<T> => {
  const url = new URL(
    path.startsWith("http")
      ? path
      : `https://api.themoviedb.org/3${path.startsWith("/") ? path : `/${path}`}`,
  );

  const { bearer, apiKey } = getTmdbCredentials();
  if (apiKey) {
    url.searchParams.set("api_key", apiKey);
  }

  for (const [key, value] of Object.entries(query)) {
    if (value !== undefined && value !== "") {
      url.searchParams.set(key, String(value));
    }
  }

  const headers: Record<string, string> = {
    accept: "application/json",
  };
  if (bearer) {
    headers.Authorization = `Bearer ${bearer}`;
  }

  const res = await fetch(url, { headers });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`TMDB ${path} failed: ${res.status} ${body.slice(0, 200)}`);
  }

  return res.json() as Promise<T>;
};
