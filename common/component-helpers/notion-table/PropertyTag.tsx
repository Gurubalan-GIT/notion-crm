import { notionColors } from "@common/utils/helpers/notion";
import { Tag } from "antd";
import { FunctionComponent } from "react";

type Props = {
  color: string;
  text: string;
};

const PropertyTag: FunctionComponent<Props> = ({ color, text }) => {
  return (
    <Tag style={{ color: "black" }} color={notionColors[color!]}>
      {text}
    </Tag>
  );
};

export default PropertyTag;
