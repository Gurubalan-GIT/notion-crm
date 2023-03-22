import { getNestedUpdate } from "@common/utils/helpers/filters";
import { Dispatch, RootState } from "@rematch-notion/store";
import { FunctionComponent } from "react";
import { useDispatch, useSelector } from "react-redux";
import NestedFilters from "./NestedFilters";

const AppliedFilters: FunctionComponent<{}> = () => {
  const { columns } = useSelector(
    (state: RootState) => state.filteredTableData
  );

  const tableDataOrganizers = useSelector(
    (state: RootState) => state.tableDataOrganizers
  );

  const { filters } = tableDataOrganizers;

  const dispatch = useDispatch<Dispatch>();

  const handleChange = (
    depth: number,
    pathIndex: number,
    value: any,
    action: string,
    compoundFilterKey: string
  ) => {
    dispatch.tableDataOrganizers.setFilters(
      getNestedUpdate(
        structuredClone(filters),
        depth,
        pathIndex,
        value,
        action,
        compoundFilterKey
      )
    );
  };

  return (
    <NestedFilters
      columns={columns}
      filters={tableDataOrganizers.filters}
      handleChange={handleChange}
    />
  );
};

export default AppliedFilters;
