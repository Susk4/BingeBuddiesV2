import { useTmdbProvidersQuery } from "../../src/hook/useTmdb";
import { useProviderContext } from "../../src/hook/useFilter";

import { useMemo } from "react";
import UserFilterRowWrapper from "./UserFilterRowWrapper";
import BingeSelect from "../misc/BingeSelect";

const ProviderList = () => {
  const { providers, setProviders } = useProviderContext();
  const { data: supportedProviders = [], isLoading } = useTmdbProvidersQuery();

  const providerOptions = useMemo(
    () =>
      supportedProviders.map((provider) => ({
        value: provider.provider_id,
        label: provider.provider_name,
      })),
    [supportedProviders],
  );

  const handleOnChange = (selected: { value: number }[]) => {
    setProviders(selected.map((item) => item.value));
  };

  const selectedOptions = useMemo(
    () =>
      providerOptions.filter((option) =>
        providers?.some((id) => id === option.value),
      ),
    [providers, providerOptions],
  );

  return (
    <UserFilterRowWrapper title="Providers">
      <BingeSelect
        isMulti={true}
        isSearchable={false}
        isDisabled={providers === null}
        isLoading={isLoading || providers === null}
        options={providerOptions}
        value={selectedOptions}
        onChange={handleOnChange}
      />
    </UserFilterRowWrapper>
  );
};
export default ProviderList;
