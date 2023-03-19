import { Dispatch, RootState } from "@rematch-notion/store";
import { Table } from "antd";
import ReactDragListView from "react-drag-listview";
import { useDispatch, useSelector } from "react-redux";
import ResizableTitle from "../ResizableTitle";

const ReOrderableTable = () => {
  const { columns, dataSource } = useSelector(
    (state: RootState) => state.filteredTableData
  );

  const dispatch = useDispatch<Dispatch>();

  const handleResize =
    (index: number) =>
    (e: Event, { size }: { size: any }) => {
      const resizedColumns = [...columns!];
      resizedColumns[index] = {
        ...resizedColumns[index],
        width: size.width,
      };
      dispatch.canonicalTableData.setCanonicalTableColumns(resizedColumns);
    };

  const dragProps = {
    onDragEnd(fromIndex: number, toIndex: number) {
      const rearrangedColumns = [...columns!];
      const item = rearrangedColumns.splice(fromIndex, 1)[0];
      rearrangedColumns.splice(toIndex, 0, item);
      dispatch.canonicalTableData.setCanonicalTableColumns(rearrangedColumns);
    },
    nodeSelector: "th",
    handleSelector: ".dragHandler",
    ignoreSelector: "react-resizable-handle",
  };

  const resizableColumns: any = columns!.map((col, index) => ({
    ...col,
    onHeaderCell: (column: any) => ({
      width: column.width,
      onResize: handleResize(index),
    }),
  }));

  return (
    <ReactDragListView.DragColumn {...dragProps}>
      <Table
        pagination={false}
        bordered
        components={{
          header: {
            cell: ResizableTitle,
          },
        }}
        columns={resizableColumns}
        dataSource={dataSource}
      />
    </ReactDragListView.DragColumn>
  );
};

export default ReOrderableTable;
