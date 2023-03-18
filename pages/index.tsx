import { queryNotionDatabase } from "@common/lib/notionClient";
import { getTableDataFromNotionDatabase } from "@common/utils/helpers/notion";
import Home from "@modules/Home";
import { QueryDatabaseResponse } from "@notionhq/client/build/src/api-endpoints";
import { Dispatch } from "@rematch-notion/store";
import { NextPage } from "next";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

type Props = {
  canonicalData: QueryDatabaseResponse["results"];
};

const HomePage: NextPage<Props> = (props) => {
  const { canonicalData } = props;
  const dispatch = useDispatch<Dispatch>();

  useEffect(() => {
    dispatch.canonicalData.setCanonicalData(canonicalData);
    dispatch.canonicalTableData.setCanonicalTableData(
      getTableDataFromNotionDatabase(canonicalData)
    );
  });

  return <Home />;
};

export async function getServerSideProps() {
  return {
    props: {
      canonicalData: await queryNotionDatabase(),
    },
  };
}

export default HomePage;
