import { Button, Space } from "antd";
import React, { FunctionComponent } from "react";

type Props = {
  children?: React.ReactNode;
  renderCompoundType: () => React.ReactNode;
  handleAddFilter: (isGroupFilter?: boolean) => void;
};

const NestedFilterLayout: FunctionComponent<Props> = (props) => {
  const { renderCompoundType, children, handleAddFilter } = props;
  return (
    <Space>
      {renderCompoundType()}
      <div className="p-[10px] pl-[20px] m-[10px] flex flex-col rounded-sm border-[1px] border-solid border-gray-200 bg-gray-50 shadow-sm shadow-gray-200">
        {children}
        <Space className="pt-[5px]">
          <Button onClick={() => handleAddFilter()} size="small">
            + Add a filter rule
          </Button>
          <Button onClick={() => handleAddFilter(true)} size="small">
            + Add a filter Group
          </Button>
        </Space>
      </div>
    </Space>
  );
};

export default NestedFilterLayout;
