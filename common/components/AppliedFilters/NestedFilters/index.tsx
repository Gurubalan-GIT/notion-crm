import { CloseOutlined } from "@ant-design/icons";
import { CustomPageObjectResponse, DataSourceType } from "@common/types/global";
import { isEmptyValue, isObjectEmpty } from "@common/utils/helpers/global";
import {
  filterActions,
  filterConditionsActionHashMap,
  filterOptionsHashMap,
} from "@common/utils/helpers/hashmaps";
import {
  IS_EMPTY_FILTER,
  IS_NOT_EMPTY_FILTER,
} from "@common/utils/localization";
import { Col, DatePicker, Input, InputNumber, Select, Space } from "antd";
import { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import NestedFilterLayout from "layouts/NestedFilterLayout";
import { FunctionComponent, useEffect, useState } from "react";
const { Option } = Select;

type Props = {
  filters: any;
  columns: ColumnsType<DataSourceType> | undefined;
  depth?: number;
  pathIndex?: number;
  handleChange?: any;
  compoundFilterKey?: string;
};

const NestedFilters: FunctionComponent<Props> = (props) => {
  const {
    filters,
    columns,
    depth = 0,
    pathIndex = 0,
    handleChange,
    compoundFilterKey = filters?.and ? "and" : filters?.or ? "or" : "",
  } = props;
  const [columnValue, setColumnValue] = useState(filters?.property);
  const [filterCondition, setFilterCondition] = useState<null | string>(null);
  const [inputValue, setInputValue] = useState(null);

  useEffect(() => {
    if (filters?.property) {
      setColumnValue(filters?.property);
    }
  }, [filters?.property]);

  useEffect(() => {
    if (columnValue) {
      const filterType = (columns as any)?.find(
        (column: any) => column.dataIndex === columnValue
      )?.type;
      if (filterType) {
        setFilterCondition(
          Object.keys(filterConditionsActionHashMap[filterType])[0]
        );
      }
    }
  }, [columnValue, columns]);

  useEffect(() => {
    if (columnValue && filterCondition) {
      const filterType = (columns as any)?.find(
        (column: any) => column.dataIndex === columnValue
      )?.type;
      setInputValue(filters?.[filterType]?.[filterCondition!]);
    }
  }, [columnValue, columns, filterCondition, filters]);

  const handleAddFilter = (isGroupFilter: boolean = false) => {
    const commonNewFilter = {
      property: "name",
      title: {
        contains: "",
      },
    };
    handleChange(
      depth + 1,
      pathIndex,
      isGroupFilter
        ? {
            and: [commonNewFilter],
          }
        : commonNewFilter,
      filterActions.ADD,
      compoundFilterKey
    );
  };

  const handleChangeCompositionFilter = () => {
    handleChange(
      depth,
      pathIndex,
      filters,
      filterActions.UPDATE_COMPOUND_FILTER,
      compoundFilterKey
    );
  };

  const renderCompoundType = () => {
    switch (pathIndex) {
      case 0:
        return <span>Where</span>;
      case 1:
        return (
          <Select
            style={{ width: 60 }}
            size="small"
            onChange={handleChangeCompositionFilter}
            value={compoundFilterKey}
          >
            <Option key={1} value="and">
              and
            </Option>
            <Option key={2} value="or">
              or
            </Option>
          </Select>
        );
      default:
        return <span>{compoundFilterKey}</span>;
    }
  };

  if (filters?.and) {
    return !!filters.and.length ? (
      <NestedFilterLayout
        renderCompoundType={renderCompoundType}
        handleAddFilter={handleAddFilter}
      >
        {filters.and.map((filter: any, filterIndex: number) => (
          <NestedFilters
            key={filterIndex + depth}
            columns={columns}
            filters={filter}
            depth={depth + 1}
            pathIndex={filterIndex}
            handleChange={handleChange}
            compoundFilterKey="and"
          />
        ))}
      </NestedFilterLayout>
    ) : null;
  }

  if (filters?.or) {
    return !!filters.or.length ? (
      <NestedFilterLayout
        renderCompoundType={renderCompoundType}
        handleAddFilter={handleAddFilter}
      >
        {filters.or.map((filter: any, filterIndex: number) => (
          <NestedFilters
            key={filterIndex + depth}
            columns={columns}
            filters={filter}
            depth={depth + 1}
            pathIndex={filterIndex}
            handleChange={handleChange}
            compoundFilterKey="or"
          />
        ))}
      </NestedFilterLayout>
    ) : null;
  }

  if (filters && isObjectEmpty(filters)) return null;

  const filterType = (columns as any)?.find(
    (column: any) => column.dataIndex === columnValue
  )?.type;

  const handleInputChange = (value: any) => {
    setInputValue(value);
    handleChange(
      depth,
      pathIndex,
      {
        property: columnValue,
        [filterType]: {
          [filterCondition!]: value,
        },
      },
      filterActions.UPDATE,
      compoundFilterKey
    );
  };

  const handleFilterConditionChange = (value: any) => {
    setFilterCondition(value);

    handleChange(
      depth,
      pathIndex,
      {
        property: columnValue,
        [filterType]: {
          [value]:
            value === IS_EMPTY_FILTER || value === IS_NOT_EMPTY_FILTER
              ? ""
              : inputValue,
        },
      },
      filterActions.UPDATE,
      compoundFilterKey
    );
  };

  const renderInputByType = (type: CustomPageObjectResponse["type"]) => {
    const value = filters?.[type]?.[filterCondition!];
    switch (type) {
      case "title":
      case "rich_text":
      case "select":
      case "status":
        return (
          <Input
            size="small"
            onChange={(e) => handleInputChange(e.target.value)}
            value={value}
          />
        );
      case "number":
        return (
          <InputNumber
            size="small"
            value={value}
            onChange={(value) => handleInputChange(value)}
            type="number"
          />
        );
      case "checkbox":
        return (
          <Select
            onChange={(value) => handleInputChange(value)}
            placeholder="Please select"
            size="small"
            value={value}
          >
            <Option key={1} value={true}>
              Checked
            </Option>
            <Option key={2} value={false}>
              Unchecked
            </Option>
          </Select>
        );
      case "date":
      case "last_edited_time":
        return (
          <DatePicker
            size="small"
            value={value ? dayjs(value) : dayjs()}
            onChange={(value) =>
              handleInputChange(dayjs(value).format("YYYY-MM-DD"))
            }
            allowClear={false}
          />
        );
      case "multi_select":
        return (
          <Select
            mode="multiple"
            placeholder="Please select"
            value={
              isEmptyValue(value) ? [] : value?.replace(/\s/g, "").split(",")
            }
            size="small"
            onChange={(value) =>
              handleInputChange(isEmptyValue(value) ? "" : value.join(","))
            }
            style={{ width: 150 }}
          >
            {(filterOptionsHashMap as any)[columnValue]?.map(
              (option: string, optionIndex: number) => (
                <Option key={option + optionIndex} value={option}>
                  {option}
                </Option>
              )
            )}
          </Select>
        );
      default:
        return <span>Unsupported Type</span>;
    }
  };

  return (
    <Col className="p-[10px] my-[5px] flex-col flex items-start">
      <Space className="items-start" size="small">
        {renderCompoundType()}
        <Col className="flex flex-col">
          <Space>
            <Select
              size="small"
              value={columnValue}
              onChange={(value) => setColumnValue(value)}
              style={{ width: "150px" }}
            >
              {columns?.map((column: any) => (
                <Option key={column?.dataIndex} value={column?.dataIndex}>
                  {column?.value}
                </Option>
              ))}
            </Select>
            <Select
              size="small"
              value={filterCondition}
              onChange={handleFilterConditionChange}
            >
              {filterType &&
                Object.keys(filterConditionsActionHashMap[filterType]).map(
                  (condition: string, conditionIndex: number) => (
                    <Option key={conditionIndex} value={condition}>
                      {condition.replaceAll("_", " ")}
                    </Option>
                  )
                )}
            </Select>
            {!(
              filterCondition == IS_EMPTY_FILTER ||
              filterCondition == IS_NOT_EMPTY_FILTER
            ) &&
              filterType &&
              renderInputByType(filterType as CustomPageObjectResponse["type"])}
          </Space>
        </Col>
        <CloseOutlined
          onClick={() => {
            handleChange(
              depth,
              pathIndex,
              structuredClone(filters),
              filterActions.DELETE,
              compoundFilterKey
            );
          }}
          className="cursor-pointer p-[4px] rounded-sm hover:bg-gray-300"
        />
      </Space>
    </Col>
  );
};

export default NestedFilters;
