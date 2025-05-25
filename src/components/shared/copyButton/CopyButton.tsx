"use client"

import { Button ,CopyButton as MantineCopyButton} from "@mantine/core"

type Props={
  text:string,
}

export default function CopyButton({text}:Props){
  return(
    <MantineCopyButton value={text}>
      {({ copied, copy }) => (
        <Button w={150} color={copied ? "teal" : "blue"} onClick={copy}>
          {copied ? "コピーしました" : 'コピーする'}
        </Button>
      )}
    </MantineCopyButton>
  )
}