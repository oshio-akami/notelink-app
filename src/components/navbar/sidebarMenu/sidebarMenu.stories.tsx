import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import SidebarMenu from "./sidebarMenu";
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

const meta: Meta<typeof SidebarMenu> = {
  title: "Menu/HomeMenu",
  tags: ["autodocs"],
  component: SidebarMenu,
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

export const Default: StoryObj<typeof SidebarMenu> = {
  args: {
    title: "グループメニュー",
    menus: menusMock,
  },
};
