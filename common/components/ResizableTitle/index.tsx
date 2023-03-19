import classNames from "classnames";
import { FunctionComponent } from "react";
import { Resizable } from "react-resizable";
import { Props } from "./types";

const ResizableTitle: FunctionComponent<Props> = (props) => {
  const { onResize, width, className, ...restProps } = props;

  if (!width) {
    return <th {...restProps} />;
  }

  return (
    <Resizable
      width={width}
      height={0}
      handle={
        <span
          className="react-resizable-handle"
          onClick={(e) => {
            e.stopPropagation();
          }}
        />
      }
      onResize={onResize}
      draggableOpts={{ enableUserSelectHack: false }}
    >
      <th {...restProps} className={classNames(className, "!p-0")} />
    </Resizable>
  );
};

export default ResizableTitle;
