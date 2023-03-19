import { generateTableDataFromNotionDatabase } from "@common/component-helpers/notion-table";
import { queryNotionDatabase } from "@common/lib/notionClient";
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
    const tableData = generateTableDataFromNotionDatabase(canonicalData);
    dispatch.canonicalData.setCanonicalData(canonicalData);
    dispatch.canonicalTableData.setCanonicalTableData(tableData);
    dispatch.filteredTableData.setFilteredTableData(tableData);
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
