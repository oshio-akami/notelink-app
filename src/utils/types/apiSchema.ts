import { z } from "zod";


export const joinGroupSchema=z.object({
  userId:z.string(),
  groupId:z.string(),
})

export const createGroupSchema=z.object({
  userId:z.string(),
  groupId:z.string(),
})