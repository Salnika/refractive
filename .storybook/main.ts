import type { StorybookConfig } from "@storybook/react-vite";

const config: StorybookConfig = {
  addons: ["@github-ui/storybook-addon-performance-panel"],
  framework: "@storybook/react-vite",
  stories: ["../stories/**/*.stories.@(ts|tsx)"],
};

export default config;
