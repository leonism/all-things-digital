# 👋 `All Things Digital` - A Tailwind Landing Page



https://user-images.githubusercontent.com/8904/207529944-a7fdb698-551c-4a3b-8561-7d85b1c9aaf9.mp4



`All Things Digital` is a simple, minimalistic and responsive single page layout, built on top of the latest Tailwind 3.*.* technology. Make sure you have the Node JS running properly on your system to install the dependecies for the final build to function properly. 

```bash
npm run watch
```

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/leonism/all-things-digital?file=README.md)
[![Open with CodeSandbox](https://assets.codesandbox.io/github/button-edit-lime.svg)](https://codesandbox.io/s/github.com/leonism/all-things-digital/)
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fleonism%2Fall-things-digital)

![Alt text](/back2school.png?raw=true)

## 🚀 Features

- ✅ **Responsive mobile-friendly design**
- ✅ **Using the latest Tailwind 3.2.4**
- ✅ **Tested on various devices with different viewports**
- ✅ **Dark Mode**
- ✅ **Contact Form**

## 😏 Todos

- ❎ **More Pages Design**
- ❎ **Multi-language i18n**
- ❎ **Dark mode**

## 🤓 How To

Install dependencies (Tailwind)

```
npm install
```

Run the Tailwind CLI to compile the **input.css** during development. The output file is **dist/output.css**

- `input.css`  located at `./src/input.css`
- `output.css` located at `./dist/output.css`


```
npm run watch
```

To build once run.

```
npm run build
```

You can edit the scripts in package.json and the `tailwind.config.js` file to change `input/output` locations and the script commands.

## 🔗 Credits

- [Tailwind Framework](https://tailwindcss.com/docs/installation/)
- [Figma Design](https://www.figma.com/community/file/1012878506205031695)
- [Hero Icons](https://heroicons.com/)
- [VS Code Editor](https://code.visualstudio.com/)

## 🧬 Versions

- [all-things-digital @ github](https://github.com/leonism/all-things-digital)
- [all-things-digital @ vercel](https://all-things-digital.vercel.app/)
- [all-things-digital @ netlify](https://all-things-digital.netlify.app/)
- [all-things-digital @ cloudflare](https://all-things-digital.pages.dev)
- [all-things-digital @ render](https://all-things-digital.onrender.com)

## License
Distributed under the MIT License - Nov - 2022

`"scripts": {
    "dev": "tailwindcss -i ./src/main.css -o ./dist/style.css",
    "build": "tailwindcss -i ./src/main.css -o ./dist/style.css",
    "watch": "tailwindcss -i ./src/main.css -o ./dist/style.css --watch",
    "compress": "npx tailwindcss -o ./dist/style.css --minify"
  }`
