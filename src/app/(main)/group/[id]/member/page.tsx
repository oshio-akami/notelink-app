import getGroupMembers from "@/actions/group/getGroupMembers";
import InviteInfo from "./_components/inviteInfo/InviteInfo";
import MemberList from "./_components/memberList/MemberList";

export const dynamic = 'force-dynamic';

type Props={
  params:Promise<{id:string}>,
}

export default async function Member({params}:Props){
  const {id}=await params;
  const members=await getGroupMembers(id);
  return(
    <>
      <InviteInfo params={params}/>
      <MemberList members={members}/>
    </>
  )
}