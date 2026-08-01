import Select from "react-select";

import React from "react";

const BingeSelect = (props) => {
  const optionsWithSelectAll = props.isMulti
    ? [{ value: "all", label: "Select All" }, ...props.options]
    : props.options;
  const handleOnChange = (selectedOptions) => {
    if (
      props.isMulti &&
      selectedOptions.some((option) => option.value === "all")
    ) {
      props.onChange(
        optionsWithSelectAll.filter((option) => option.value !== "all")
      );
    } else {
      props.onChange(selectedOptions);
    }
  };

  return (
    <Select
      isMulti={props.isMulti}
      options={optionsWithSelectAll}
      isLoading={props.isLoading}
      isDisabled={props.isDisabled}
      onChange={handleOnChange}
      value={props.value}
      getOptionValue={(option) => option.label}
      menuPlacement="auto"
      className={`binge-select-container ${props.className}`}
      classNamePrefix="binge-select"
      isSearchable={props.isSearchable}
      blurInputOnSelect={true}
    />
  );
};

export default BingeSelect;
