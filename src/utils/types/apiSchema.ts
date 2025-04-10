import { z } from "zod";

export const joinGroupSchema=z.object({
  userId:z.string().uuid(),
  groupId:z.string().uuid(),
})

export const createGroupSchema=z.object({
  userId:z.string().uuid(),
  groupId:z.string().uuid(),
})

export const getGroupNameSchema=z.object({
  groupId:z.string().uuid(),
})

export const getGroupsSchema=z.object({
  userId:z.string().uuid(),
})
