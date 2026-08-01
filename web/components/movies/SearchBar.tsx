import React from "react";
import Input from "../ui/Input";
import Button from "../ui/Button";

const SearchBar = ({
  query,
  setQuery,
  handleSearch,
}: {
  query: string;
  setQuery: (q: string) => void;
  handleSearch: () => void;
}) => {
  return (
    <form
      className="flex flex-col gap-3 sm:flex-row sm:items-stretch"
      onSubmit={(e) => {
        e.preventDefault();
        handleSearch();
      }}
    >
      <Input
        type="search"
        value={query}
        placeholder="Search by title…"
        className="flex-1"
        onChange={(e) => setQuery(e.target.value)}
      />
      <Button type="submit" variant="primary" className="sm:min-w-[7.5rem]">
        Search
      </Button>
    </form>
  );
};

export default SearchBar;
