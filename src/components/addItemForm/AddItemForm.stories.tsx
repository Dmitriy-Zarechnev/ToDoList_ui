import type { Meta, StoryObj } from "@storybook/react";
import { AddItemForm } from "./AddItemForm";


const meta: Meta<typeof AddItemForm> = {
  title: "TODOLISTS/AddItemForm",
  component: AddItemForm,

  tags: ["autodocs"],

  argTypes: {
    addItem: {
      description: "Button clicked inside form",
      action: "clicked",
    },
  },
};

export default meta;

type Story = StoryObj<typeof AddItemForm>;

export const AddItemFormBase: Story = {
  args: {

  },
};

export const AddItemFormStoryDisabled: Story = {
  args: {
    disabled: "loading",

  },
};
