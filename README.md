# Teemo 💕

[![Gitmoji][gitmoji]][gitmoji-url] [![semantic-release][semantic-release]][semantic-release-repo] ![][license-url]

[![Build CI status][build-ci]][build-ci-url] [![Release CI status][release-ci]][release-ci-url]

<!-- badge -->

[gitmoji]: https://img.shields.io/badge/gitmoji-%20😜%20😍-FFDD67.svg
[gitmoji-url]: https://gitmoji.carloscuesta.me/
[semantic-release]: https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg
[semantic-release-repo]: https://github.com/semantic-release/semantic-release
[license-url]: https://img.shields.io/github/license/nikaera/Teemo

<!-- Github CI -->

[build-ci]: https://github.com/nikaera/Teemo/workflows/Build/badge.svg
[release-ci]: https://github.com/nikaera/Teemo/workflows/Release/badge.svg
[build-ci-url]: https://github.com/nikaera/Teemo/actions?query=workflow%3A%22Build%22
[release-ci-url]: https://github.com/nikaera/Teemo/actions?query=workflow%3A%22Release%22

Quickly generate chat messages with embedded emoji! 💖😆  
Chrome Extensions can be added from [the store page](https://chrome.google.com/webstore/detail/teemo-%F0%9F%92%95/alhdkgcgpmdfbidaapdlnmbhoanoijka?hl=ja&authuser=0). 🛍️🦸

This is Chrome Extension that allows you to edit chat messages in a text field that can use emoji shortcuts like [Slack](https://www.guidingtech.com/slack-emojis-tips-tricks/#:~:text=While%20Slack%20has%20provided%20the,few%20letters%20of%20the%20emoji.). 👀💨

This is [the promotional video](https://www.youtube.com/watch?v=bJTHbzw1Ee4) for Teemo as follows. 👱‍♂️🎥

<p align="center">
  <a href="https://www.youtube.com/watch?v=bJTHbzw1Ee4" target="_blank" rel="noopener noreferrer">
    <img width="640" height="480" src="http://img.youtube.com/vi/bJTHbzw1Ee4/sddefault.jpg">
  </a>
</p>

## 🛠️ Requirement

- [Node.js](https://nodejs.org/) 14.10.1
- [React](https://ja.reactjs.org/) 17.0.2
- [Emoji Mart](https://github.com/missive/emoji-mart) 3.0.1

## 🏃 Getting Started

```bash
npm install
npm start
```

After executing the above, go to [http://localhost:3000](http://localhost:3000) and you should see the screen. 😎  
Go ahead and develop it to your own taste! 😋🍴

## 💾 Installation

```bash
npm run build
```

After executing the above, a `build` folder will be created in the project, and you can use the plugin by loading it with Chrome following the steps. 👉 [https://developer.chrome.com/docs/extensions/mv3/getstarted/#manifest](https://developer.chrome.com/docs/extensions/mv3/getstarted/#manifest)

> 1. Open the Extension Management page by navigating to chrome://extensions.
>
> - Alternatively, open this page by clicking on the Extensions menu button and selecting **Manage Extensions** at the bottom of the menu.
> - Alternatively, open this page by clicking on the Chrome menu, hovering over **More Tools** then selecting **Extensions**
>
> 2. Enable Developer Mode by clicking the toggle switch next to **Developer mode**.
> 3. Click the **Load unpacked** button and select the extension directory.

## 👨‍💻 Usage

- Ctrl or Cmd + Shift + O
  - Toggle open or close the text editor. ✍️
- While the text editor is open ☝️
  - Ctrl + R
    - Clear the text area. 🆕
  - Ctrl + E
    - Toggle open or close the emoji picker . 🎨
  - Ctrl + C
    - Copy the text you are typing. 📋

## 🎁 Contributing

If you have any questions, please feel free to create an [Issue](https://github.com/nikaera/Teemo/issues/new) or [PR](https://github.com/nikaera/Teemo/pulls) for you! 🙌

## License

[MIT](https://github.com/nikaera/Teemo/blob/main/LICENSE)
