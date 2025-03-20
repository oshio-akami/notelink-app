import { useSession,signOut } from "next-auth/react"

export function Logout(){
  const session=useSession();
  if(session){
    return (
      <div>
        <button onClick={()=>signOut()}>ログアウト</button>
      </div>
    )
    return null;
  }
}