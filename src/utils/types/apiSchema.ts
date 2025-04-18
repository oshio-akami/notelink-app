import { z } from "zod";

const userIdSchema=z.object({
  userId:z.string().uuid(),
})
const groupIdSchema=z.object({
  groupId:z.string().uuid(),
})

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

export const joinGroupSchema=z.object({
  userId:z.string().uuid(),
  groupId:z.string().uuid(),
  roleId:z.number().default(2),
})

export const inviteSchema=z.object({
  groupId:z.string().uuid(),
})

export const validInviteTokenSchema=z.object({
  inviteToken:z.string().uuid(),
})

export const joinInviteGroupSchema=z.object({
  inviteToken:z.string().uuid(),
  userId:z.string().uuid(),
})

export const getGroupMembersSchema=z.object({
  userId:z.string().uuid(),
  groupId:z.string().uuid(),
})

export const leaveGroupSchema=z.object({
  userId:z.string().uuid(),
  groupId:z.string().uuid(),
})

