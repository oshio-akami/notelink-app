"use client"

import { Button ,CopyButton} from "@mantine/core"

type Props={
  text:string,
}

export default function Copy({text}:Props){
  return(
    <CopyButton value={text}>
      {({ copied, copy }) => (
        <Button w={150} color={copied ? "teal" : "blue"} onClick={copy}>
          {copied ? "コピーしました" : 'コピーする'}
        </Button>
      )}
    </CopyButton>
  )
}