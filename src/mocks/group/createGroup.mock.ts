import { fn } from "@storybook/test";
import { createGroup as Action } from "#src/actions/group/createGroup.js";

export const createGroup = fn(Action).mockName("createGroup");
