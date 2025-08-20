import GroupsList from "@/components/home/groupList/groupList";
import { getClient } from "@/libs/hono";

const getGroupSummaries = async () => {
  const client = await getClient();
  const res = await client.api.user.groups.summary.$get();
  const result = await res.json();
  console.log(result);
  return result.summaries ?? [];
};

export default async function Home() {
  const groupSummaries = await getGroupSummaries();
  console.log(groupSummaries);
  return (
    <>
      <GroupsList groupSummaries={groupSummaries} />
    </>
  );
}
