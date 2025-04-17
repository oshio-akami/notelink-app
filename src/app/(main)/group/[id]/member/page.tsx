import InviteInfo from "./_components/inviteInfo/InviteInfo";

export const dynamic = 'force-dynamic';

type Props={
  params:Promise<{id:string}>,
}

export default function Member({params}:Props){
  return(
    <>
      <div>Member</div>
      <InviteInfo params={params}/>
    </>
  )
}