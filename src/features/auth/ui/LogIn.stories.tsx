import type { Meta, StoryObj } from "@storybook/react";
import { LogIn } from "./LogIn";
import { HashRouterDecorator, ReduxStoreProviderDecorator } from "common/stories/decorators/ReduxStoreProviderDecorator";

const meta: Meta<typeof LogIn> = {
  title: "TODOLISTS/LogIn",
  component: LogIn,

  tags: ["autodocs"],
  decorators: [ReduxStoreProviderDecorator, HashRouterDecorator],
};

export default meta;

type Story = StoryObj<typeof LogIn>;

export const LogInStoryExample = () => {
  return <LogIn />;
};
