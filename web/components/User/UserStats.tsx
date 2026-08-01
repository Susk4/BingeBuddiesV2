import UserFilterRowWrapper from "./UserFilterRowWrapper";

const UserStats = ({ user }) => {
  return (
    <UserFilterRowWrapper title={"Statistics"}>
      <div className="flex flex-col  ">
        <StatsRowWrapper
          title="Friends:"
          value={Math.floor(Math.random() * 100)}
        />
        <StatsRowWrapper
          title={"Reviews:"}
          value={Math.floor(Math.random() * 100)}
        />
        <StatsRowWrapper
          title="Like movies:"
          value={Math.floor(Math.random() * 100)}
        />

        <StatsRowWrapper
          title={"Movies binged:"}
          value={Math.floor(Math.random() * 100)}
        />
        <StatsRowWrapper
          title={"Badges earned:"}
          value={Math.floor(Math.random() * 100)}
        />
      </div>
    </UserFilterRowWrapper>
  );
};
export default UserStats;

const StatsRowWrapper = ({ title, value }) => {
  return (
    <div className="flex flex-row justify-between">
      <span>{title}</span>
      <span>{value}</span>
    </div>
  );
};
