import styles from "./homeSidebar.module.css"
import SearchBar from "@/components/ui/searchBar/SearchBar"

export default function HomeSidebar(){
  return(
    <div className={styles.page}>
      <SearchBar />
    </div>
  )
}