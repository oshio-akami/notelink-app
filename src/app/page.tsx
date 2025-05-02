import Link from "next/link";
import { Text,Button } from "@mantine/core";

export default function Page() {
  return (
  <>
    <Text>最初のページ(仮)</Text>
    <Link href="/login">
      <Button>ログインする</Button>
    </Link>
  </>
  )
}
