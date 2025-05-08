import { ScrollArea } from "@mantine/core"
import styles from "./homeSidebar.module.css"
import SearchBar from "@/components/ui/searchBar/SearchBar"

export default function HomeSidebar(){
  return(
    <ScrollArea className={styles.page}>
      <SearchBar />
    </ScrollArea>
  )
}