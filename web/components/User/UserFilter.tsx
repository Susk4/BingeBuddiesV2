import ReleaseYearRange from "./ReleaseYearRange";
import GenreList from "./GenreList";
import ProviderList from "./ProviderList";


import type { SessionUser } from "@binge-buddies/shared";

type UserFilterProps = {
  user: SessionUser;
};

const UserFilter = ({ user }: UserFilterProps) => {

  return (
    <div>
      <h1 className="text-3xl text-center">
        What are you looking for?
      </h1>
      <ReleaseYearRange />
      <GenreList />
      <ProviderList />
    </div>
  );
};

export default UserFilter;
