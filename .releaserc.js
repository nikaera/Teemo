module.exports = {
  branches: ["main"],
  plugins: [
    [
      "@semantic-release/commit-analyzer",
      {
        releaseRules: [
          { type: "feat", release: "minor" },
          { type: "fix", release: "patch" },
          { type: "docs", release: "patch" },
          { type: "chore", scope: "release", release: "patch" },
          { scope: "no-release", release: false },
        ],
      },
    ],
    "@semantic-release/release-notes-generator",
    [
      "@semantic-release/github",
      {
        assets: [
          {
            path: "teemo-chrome-extension.zip",
            label: "Teemo - Chrome Extension",
          },
        ],
      },
    ],
  ],
};
