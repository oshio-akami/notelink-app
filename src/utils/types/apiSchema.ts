import { z } from "zod";

export const joinedGroupsSchema=z.object({
  userId:z.string().uuid(),
})

export const setCurrentGroupSchema = z.object({
  currentGroupId: z.string(),
  userId:z.string(),
});

export const hasJoinedGroupSchema=z.object({
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

