import { LoadingOutlined } from "@ant-design/icons";
import AppliedSortOptions from "@common/components/AppliedSortOptions";
import ReOrderableTable from "@common/components/ReOrderableTable";
import SortOptionsPopover from "@common/components/SortOptionsPopover";
import { sortByProperties } from "@common/utils/helpers/global";
import { Dispatch, RootState } from "@rematch-notion/store";
import { Button, Col, Popover, Row, Space } from "antd";
import { FunctionComponent, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Props } from "./types";

const Home: FunctionComponent<Props> = () => {
  const { isLoading, dataSource } = useSelector(
    (state: RootState) => state.filteredTableData
  );

  const tableDataOrganizers = useSelector(
    (state: RootState) => state.tableDataOrganizers
  );

  const { sorts } = tableDataOrganizers;

  const dispatch = useDispatch<Dispatch>();

  const sortedDataSource = useMemo(() => {
    const updatedDataSource = [...dataSource!];
    updatedDataSource.sort(sortByProperties(tableDataOrganizers.sorts));
    return updatedDataSource;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tableDataOrganizers]);

  useEffect(() => {
    dispatch.filteredTableData.setFilteredTableDataSource(sortedDataSource);
  }, [dispatch.filteredTableData, sortedDataSource]);

  return (
    <div className="h-screen w-full flex justify-center items-center">
      {isLoading ? (
        <LoadingOutlined style={{ fontSize: 24 }} spin />
      ) : (
        <Col>
          <Row className="pb-[20px] w-full flex justify-end">
            <Space>
              <Button size="small">Filter</Button>
              <Popover
                key="sort-options-popover"
                content={SortOptionsPopover}
                trigger="click"
                placement="bottom"
                arrow={false}
                className="p-0"
              >
                <Button size="small">Add Sort</Button>
              </Popover>
            </Space>
          </Row>
          <Row className="pb-[10px]">
            {!!sorts.length && (
              <Popover
                key="applied-sorts-popover"
                content={AppliedSortOptions}
                trigger="click"
                placement="bottom"
                arrow={false}
              >
                <Button size="small">{sorts.length} Sorts Applied</Button>
              </Popover>
            )}
          </Row>
          <ReOrderableTable />
        </Col>
      )}
    </div>
  );
};

export default Home;
