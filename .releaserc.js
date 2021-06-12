module.exports = {
  branches: ["main"],
  plugins: [
    [
      "@semantic-release/commit-analyzer",
      {
        config: "conventional-changelog-gitmoji-config",
        releaseRules: [{ type: "build", release: "patch" }],
      },
    ],
    [
      "@semantic-release/release-notes-generator",
      {
        config: "conventional-changelog-gitmoji-config",
      },
    ],
    [
      "@semantic-release/git",
      {
        message:
          // eslint-disable-next-line no-template-curly-in-string
          ":bookmark: chore(release): ${nextRelease.gitTag} [skip ci] \n\n${nextRelease.notes}",
      },
    ],
    [
      "@semantic-release/github",
      {
        assets: [
          {
            path: "teemo-chrome.zip",
            label: "Teemo 💕 - Chrome Extension",
          },
        ],
      },
    ],
  ],
};
