const ComingSoon = ({ title, shortDescription, longDescription }) => {
  return (
    <div className="flex flex-col text-center">
      <h1 className="text-4xl md:text-9xl">{title}</h1>
      <h2 className="text-xl md:text-4xl">{shortDescription}</h2>
      <h3 className="text-xl md:text-2xl">{longDescription}</h3>
    </div>
  );
};
export default ComingSoon;
