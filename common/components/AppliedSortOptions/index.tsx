import { CloseOutlined } from "@ant-design/icons";
import { Dispatch, RootState } from "@rematch-notion/store";
import { Col, Select, Space } from "antd";
import { useDispatch, useSelector } from "react-redux";
const { Option } = Select;
const AppliedSortOptions = () => {
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
    const updatedSortFields = [...sorts!];
    updatedSortFields[sortFieldIndex][key] = value;
    dispatch.tableDataOrganizers.setSorts(updatedSortFields);
  };

  const removeSortField = (property: string) => {
    dispatch.tableDataOrganizers.setSorts(
      sorts.filter((sortField) => sortField.property !== property)
    );
  };

  return (
    <Col className="p-[12px] flex-col flex items-center">
      {sorts?.map((sortField, sortFieldIndex) => (
        <Space
          size="middle"
          key={sortField.key}
          className="pb-[10px]"
          align="center"
        >
          <Select
            defaultValue={sortField?.property}
            onChange={(value) =>
              handleSortFieldChange(value, sortFieldIndex, "property")
            }
            style={{ width: "150px" }}
          >
            {columns?.map((column: any) => (
              <Option key={column?.key} value={column?.dataIndex}>
                {column?.value}
              </Option>
            ))}
          </Select>
          <Select
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
            onClick={() => removeSortField(sortField.property)}
            className="cursor-pointer hover:bg-grey-200 p-[4px] rounded-md"
          />
        </Space>
      ))}
    </Col>
  );
};

export default AppliedSortOptions;
