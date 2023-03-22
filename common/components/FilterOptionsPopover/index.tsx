import { filterConditionsActionHashMap } from "@common/utils/helpers/hashmaps";
import { Dispatch, RootState } from "@rematch-notion/store";
import { Col, Row } from "antd";
import dayjs from "dayjs";
import { useDispatch, useSelector } from "react-redux";

const FilterOptionsPopover = () => {
  const { columns } = useSelector(
    (state: RootState) => state.filteredTableData
  );

  const dispatch = useDispatch<Dispatch>();

  return (
    <Col className="w-[150px] h-[200px] overflow-y-auto">
      {columns?.map((column: any) => (
        <Row
          className="p-[8px] hover:bg-grey-200 cursor-pointer"
          key={column.key}
          onClick={() => {
            const filterType = column?.type;
            dispatch.tableDataOrganizers.setFilters({
              and: [
                {
                  property: column.dataIndex,
                  [filterType]: {
                    [Object.keys(filterConditionsActionHashMap[filterType])[0]]:
                      filterType === "date" || "last_edited_time"
                        ? dayjs()
                        : "",
                  },
                },
              ],
            });
          }}
        >
          {column.value}
        </Row>
      ))}
    </Col>
  );
};

export default FilterOptionsPopover;
