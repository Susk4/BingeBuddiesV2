import { useTmdbGenresQuery } from "../../src/hook/useTmdb";
import { useMemo } from "react";
import { useGenreContext } from "../../src/hook/useFilter";

import UserFilterRowWrapper from "./UserFilterRowWrapper";
import BingeSelect from "../misc/BingeSelect";

const GenreList = () => {
  const { genres, setGenres } = useGenreContext();
  const { data, isLoading } = useTmdbGenresQuery();

  const genreList = useMemo(
    () =>
      (data?.genres ?? []).map(({ name, id }) => ({
        value: id,
        label: name,
      })),
    [data],
  );

  const handleGenreChange = (selectedGenres: { value: number }[]) => {
    setGenres(selectedGenres.map((genre) => genre.value));
  };

  const selectedOptions = useMemo(
    () =>
      genreList.filter((genreListItem) =>
        genres?.some((genre) => genre == genreListItem.value),
      ),
    [genres, genreList],
  );

  return (
    <UserFilterRowWrapper title="Genres">
      <BingeSelect
        isMulti={true}
        isSearchable={false}
        isDisabled={genres === null}
        isLoading={isLoading || genres === null}
        options={genreList}
        value={selectedOptions}
        onChange={handleGenreChange}
      />
    </UserFilterRowWrapper>
  );
};

export default GenreList;
