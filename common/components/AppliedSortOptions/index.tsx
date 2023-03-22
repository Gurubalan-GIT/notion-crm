import { CloseOutlined } from "@ant-design/icons";
import { DataSourceType } from "@common/types/global";
import { Dispatch, RootState } from "@rematch-notion/store";
import { Col, Select, Space } from "antd";
import { ColumnType } from "antd/es/table";
import { FunctionComponent } from "react";
import { useDispatch, useSelector } from "react-redux";
const { Option } = Select;

const AppliedSortOptions: FunctionComponent<{}> = () => {
  const { sorts } = useSelector(
    (state: RootState) => state.tableDataOrganizers
  );

  const { columns } = useSelector(
    (state: RootState) => state.filteredTableData
  );

  const dispatch = useDispatch<Dispatch>();

  const handleSortFieldChange = (
    value: string,
    sortFieldIndex: number,
    key: string
  ) => {
    const updatedSortFields = [...sorts];
    updatedSortFields[sortFieldIndex][key] = value;
    dispatch.tableDataOrganizers.setSorts(updatedSortFields);
  };

  const removeSortField = (sortFieldIndex: number) => {
    dispatch.tableDataOrganizers.setSorts(
      sorts.filter((_, sortIndex: number) => sortIndex !== sortFieldIndex)
    );
  };

  return (
    <Col className="p-[12px] flex-col flex items-center my-5 rounded-sm border-[1px] border-solid border-grey-200">
      {sorts?.map((sortField, sortFieldIndex) => (
        <Space
          size="middle"
          key={sortField?.key}
          className="pb-[10px]"
          align="center"
        >
          <Select
            size="small"
            defaultValue={sortField?.property}
            onChange={(value) =>
              handleSortFieldChange(value, sortFieldIndex, "property")
            }
            style={{ width: "150px" }}
          >
            {columns
              ?.filter(
                (column: ColumnType<DataSourceType>) =>
                  !sorts?.some(
                    (sort) =>
                      sort?.property === column.dataIndex &&
                      sort?.property !== sortField.property
                  )
              )
              .map((column: any) => (
                <Option key={column?.key} value={column?.dataIndex}>
                  {column?.value}
                </Option>
              ))}
          </Select>
          <Select
            size="small"
            style={{ width: "150px" }}
            defaultValue={sortField?.direction}
            onChange={(value) =>
              handleSortFieldChange(value, sortFieldIndex, "direction")
            }
          >
            <Option value="ascending">Ascending</Option>
            <Option value="descending">Descending</Option>
          </Select>
          <CloseOutlined
            onClick={() => removeSortField(sortFieldIndex)}
            className="cursor-pointer hover:bg-grey-200 p-[4px] rounded-md"
          />
        </Space>
      ))}
    </Col>
  );
};

export default AppliedSortOptions;
