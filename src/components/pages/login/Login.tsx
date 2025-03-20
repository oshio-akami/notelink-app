import { useSession,signIn } from "next-auth/react"

export function Login(){
  const session=useSession();

  if(!session||session.data?.user==undefined){
    return(
      <div>
        <p>ログインしていません</p>
        <button onClick={()=>signIn("google",{},{prompt:"login"}) }>
          Googleでログインする
        </button>
      </div>
    )
  }
  return(
    <p>ログイン画面</p>
  )
}