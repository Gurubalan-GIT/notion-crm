import { LoadingOutlined } from "@ant-design/icons";
import AppliedFilters from "@common/components/AppliedFilters";
import AppliedSortOptions from "@common/components/AppliedSortOptions";
import FilterOptionsPopover from "@common/components/FilterOptionsPopover";
import ReOrderableTable from "@common/components/ReOrderableTable";
import SortOptionsPopover from "@common/components/SortOptionsPopover";
import { isObjectEmpty } from "@common/utils/helpers/global";
import {
  filterByProperties,
  sortByProperties,
} from "@common/utils/helpers/memoizers";
import { Dispatch, RootState } from "@rematch-notion/store";
import { Button, Col, Popover, Row, Space } from "antd";
import { FunctionComponent, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Props } from "./types";

const Home: FunctionComponent<Props> = () => {
  const { isLoading } = useSelector(
    (state: RootState) => state.filteredTableData
  );

  const { dataSource: canonicalDataSource } = useSelector(
    (state: RootState) => state.canonicalTableData
  );

  const tableDataOrganizers = useSelector(
    (state: RootState) => state.tableDataOrganizers
  );

  const { sorts, filters } = tableDataOrganizers;

  const dispatch = useDispatch<Dispatch>();

  const [showAppliedSorts, setShowAppliedSorts] = useState(false);
  const [showAppliedFilters, setShowAppliedFilters] = useState(false);

  const areSortsEmpty = isObjectEmpty(sorts);
  const areFiltersEmpty = isObjectEmpty(filters);

  const updatedDataSource = useMemo(() => {
    const updatedDataSource = structuredClone(canonicalDataSource)!;

    if (!areSortsEmpty) {
      updatedDataSource.sort(sortByProperties(tableDataOrganizers.sorts));
    }

    if (!areFiltersEmpty) {
      return updatedDataSource.filter((data) =>
        filterByProperties(data, filters)
      );
    }
    return updatedDataSource;
  }, [
    areFiltersEmpty,
    areSortsEmpty,
    canonicalDataSource,
    filters,
    tableDataOrganizers.sorts,
  ]);

  console.log(filters);

  useEffect(() => {
    dispatch.filteredTableData.setFilteredTableDataSource(updatedDataSource);
  }, [dispatch.filteredTableData, updatedDataSource]);

  return (
    <div className="min-h-screen w-full flex justify-center items-start py-[30px] px-[20px]">
      {isLoading ? (
        <LoadingOutlined style={{ fontSize: 24 }} spin />
      ) : (
        <Col>
          <Row className="pb-[20px] w-full flex justify-end">
            <Space size="large">
              <Popover
                key="sort-options-popover"
                content={SortOptionsPopover}
                trigger="click"
                placement="bottom"
                arrow={false}
                className="p-0"
                getPopupContainer={(triggerNode) => triggerNode.parentElement!}
              >
                <Button size="small">Add Sort</Button>
              </Popover>
              {areFiltersEmpty && (
                <Popover
                  key="filter-options-popover"
                  content={FilterOptionsPopover}
                  trigger="click"
                  placement="bottom"
                  arrow={false}
                  className="p-0"
                  getPopupContainer={(triggerNode) =>
                    triggerNode.parentElement!
                  }
                >
                  <Button size="small">Add Advanced Filter</Button>
                </Popover>
              )}
            </Space>
          </Row>
          <Space size="large" className="pb-[10px] items-start">
            {!areSortsEmpty && (
              <Col>
                <Button
                  onClick={() => setShowAppliedSorts((prevState) => !prevState)}
                  size="small"
                >
                  +{sorts.length} Sorts Applied
                </Button>
                {showAppliedSorts && <AppliedSortOptions />}
              </Col>
            )}
            {!areFiltersEmpty && (
              <Col className="flex flex-col items-start">
                <Button
                  onClick={() =>
                    setShowAppliedFilters((prevState) => !prevState)
                  }
                  size="small"
                  className="w-fit"
                >
                  +Filters Applied
                </Button>
                <Col className="mt-3">
                  {showAppliedFilters && <AppliedFilters />}
                </Col>
              </Col>
            )}
          </Space>
          <ReOrderableTable />
        </Col>
      )}
    </div>
  );
};

export default Home;
