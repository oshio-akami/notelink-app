"use client"

import { Table, TableTd, TableTr ,Avatar , TableThead,TableTh, TableTbody,Text, Flex} from "@mantine/core";

type Props={
  members: {
    userId: string | null;
    displayName: string;
    image: string | null;
    role: string;
  }[]|null
}

export default function MemberList({members}:Props){
  const rows=members?.map(member=>(
    <TableTr key={member.displayName}>
      <TableTd>
        <Flex gap={20} align="center">
          <Avatar src={member.image} alt="user Profile" />
          <Text>{member.displayName}</Text>
        </Flex>
      </TableTd>
      <TableTd>{member.role}</TableTd>
    </TableTr>
  ));
  return(
    <>
      <Table>
        <TableThead>
          <TableTr>
            <TableTh>ユーザー</TableTh>
            <TableTh>権限</TableTh>
          </TableTr>
        </TableThead>
        <TableTbody>{rows}</TableTbody>
      </Table>
    </>
  )
}