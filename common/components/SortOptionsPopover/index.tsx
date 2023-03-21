import { Dispatch, RootState } from "@rematch-notion/store";
import { Col, Row } from "antd";
import { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";

const SortOptionsPopover = () => {
  const { columns } = useSelector(
    (state: RootState) => state.filteredTableData
  );

  const { sorts } = useSelector(
    (state: RootState) => state.tableDataOrganizers
  );

  const dispatch = useDispatch<Dispatch>();

  const filteredColumns = useMemo(() => {
    return columns?.filter(
      (updatedColumn: any) =>
        !sorts?.some((sort) => sort?.property === updatedColumn.dataIndex)
    );
  }, [columns, sorts]);

  return (
    <Col className="w-[150px] h-[200px] overflow-y-auto">
      {filteredColumns?.map((column: any) => (
        <Row
          className="p-[8px] hover:bg-grey-200 cursor-pointer"
          key={column.key}
          onClick={() =>
            dispatch.tableDataOrganizers.updateSorts([
              {
                property: column.dataIndex,
                direction: "ascending",
                key: column.key,
              },
            ])
          }
        >
          {column.value}
        </Row>
      ))}
    </Col>
  );
};

export default SortOptionsPopover;
