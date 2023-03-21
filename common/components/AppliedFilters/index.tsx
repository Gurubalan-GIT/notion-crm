import { getNestedUpdate } from "@common/utils/helpers/filters";
import { Dispatch, RootState } from "@rematch-notion/store";
import { useDispatch, useSelector } from "react-redux";
import NestedFilters from "./NestedFilters";

const AppliedFilters = () => {
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
    console.log(
      structuredClone(filters),
      depth,
      pathIndex,
      value,
      action,
      compoundFilterKey
    );
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
