"use client"
import { Flex } from "@mantine/core";
import { useToggle } from "@mantine/hooks";
import { IconThumbUp,IconThumbUpFilled ,IconBookmark,IconBookmarksFilled} from "@tabler/icons-react";

export default function ArticleButton(){
  const [goodButton,toggleGoodButton]=useToggle([<IconThumbUp  key="ThumbUp" onClick={()=>toggleGoodButton()}/>,<IconThumbUpFilled key="ThumbUpFilled"  onClick={()=>toggleGoodButton()}/>] as const);
  const [bookMarkButton,toggleBookMarkButton]=useToggle([<IconBookmark key="Bookmark" onClick={()=>toggleBookMarkButton()}/>,<IconBookmarksFilled key="BookmarkFilled"  onClick={()=>toggleBookMarkButton()}/>] as const);
  return (
    <>
      <Flex gap={20} mt={20}>
        {goodButton}
        {bookMarkButton}
      </Flex>
    </>
  )
}