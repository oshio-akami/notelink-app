import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import HomeMenu from "./homeMenu";
import {
  IconDashboard,
  IconClipboardText,
  IconUsersGroup,
} from "@tabler/icons-react";

const menusMock = [
  {
    label: "ホーム",
    link: "/home",
    icon: <IconDashboard size={24} stroke={1.5} />,
  },
  {
    label: "投稿",
    link: "/post",
    icon: <IconClipboardText size={24} stroke={1.5} />,
  },
  {
    label: "メンバー",
    link: "/member",
    icon: <IconUsersGroup size={24} stroke={1.5} />,
  },
];

const meta: Meta<typeof HomeMenu> = {
  title: "Menu/HomeMenu",
  tags: ["autodocs"],
  component: HomeMenu,
  parameters: {
    nextjs: {
      navigation: {
        pathname: "/group/sample-group-id/home",
      },
    },
    layout: "centered",
  },
};

export default meta;

export const Default: StoryObj<typeof HomeMenu> = {
  args: {
    menus: menusMock,
    groupId: "sample-group-id",
  },
};
