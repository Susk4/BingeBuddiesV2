import RangeSlider from "react-range-slider-input";
import "react-range-slider-input/dist/style.css";
import { useEffect, useState } from "react";
import { useReleaseYearContext } from "../../src/hook/useFilter";
import UserFilterRowWrapper from "./UserFilterRowWrapper";
import Loading from "../misc/Loading";

const ReleaseYearRange = () => {
  const { release_year, setReleaseYear, minReleaseYear, maxReleaseYear } =
    useReleaseYearContext();

  const [value, setValue] = useState(release_year);
  useEffect(() => {
    setValue(release_year);
  }, [release_year]);

  const handleOnChange = (e) => {
    setValue({ from: e[0], to: e[1] });
  };
  const handleOnThumbDragEnd = (from, to) => {
    setReleaseYear({ from: from, to: to });
  };
  if (!value)
    return (
      <>
        <Loading />
      </>
    );
  return (
    <UserFilterRowWrapper title="Release year">
      <div className="flex flex-row items-center gap-2 text-sm text-ink-muted">
        <span>{value.from}</span>
        <RangeSlider
          defaultValue={[value.from, value.to]}
          onInput={(e) => handleOnChange(e)}
          onThumbDragEnd={() => handleOnThumbDragEnd(value.from, value.to)}
          min={minReleaseYear}
          max={maxReleaseYear}
          rangeSlideDisabled={true}
        />
        <span>{value.to}</span>
      </div>
    </UserFilterRowWrapper>
  );
};
export default ReleaseYearRange;
