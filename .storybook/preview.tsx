import type { Preview } from "@storybook/react";
import ProviderWrapper from "@/components/providerWrapper/providerWrapper";
import React from "react";

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  decorators: [
    (Story) => (
      <ProviderWrapper>
        <Story />
      </ProviderWrapper>
    ),
  ],
};

export default preview;
