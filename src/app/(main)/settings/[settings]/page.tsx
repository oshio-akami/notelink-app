import ProjectSetting from "@/components/settings/ProjectSetting"
import UserSetting from "@/components/settings/UserSetting";
import { SettingNavBar } from "@/components/layout/settingNavbar/SettingNavbar";
import MemberSetting from "@/components/settings/MemberSetting";
import AlertSetting from "@/components/settings/AlertSetting";

type Props = {
  params: Promise<{ [key: string]: string }>
}

export const runtime = "edge";

export default async function Settings(props:Props){
  const params=await props.params;
  let setting =<></>;
  switch(params.settings){
    case "projectSetting":
      setting=<ProjectSetting />;
      break;
    case "userSetting":
      setting=<UserSetting />;
      break;
    case "memberSetting":
      setting=<MemberSetting />;
      break;
    case "alertSetting":
      setting=<AlertSetting />;
      break;
  }
 return(
  <div style={{display:"flex"}}>
    <SettingNavBar params={params.settings} />
    {setting}
  </div>
 );
}