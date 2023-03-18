import { LoadingOutlined } from "@ant-design/icons";
import ReOrderableTable from "@common/components/ReOrderableTable";
import { RootState } from "@rematch-notion/store";
import { FunctionComponent } from "react";
import { useSelector } from "react-redux";
import { Props } from "./types";

const Home: FunctionComponent<Props> = () => {
  const { isLoading } = useSelector(
    (state: RootState) => state.canonicalTableData
  );

  return (
    <div className="h-screen w-full flex justify-center items-center">
      {isLoading ? (
        <LoadingOutlined style={{ fontSize: 24 }} spin />
      ) : (
        <ReOrderableTable />
      )}
    </div>
  );
};

export default Home;
