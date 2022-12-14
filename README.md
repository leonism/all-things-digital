# 👋 `All Things Digital` - A Tailwind Landing Page



https://user-images.githubusercontent.com/8904/207529944-a7fdb698-551c-4a3b-8561-7d85b1c9aaf9.mp4

## 🚀 Descriptions

Introducing our newest CSS theme: `All Things Digital` is a simple, minimalistic and responsive single page layout, built on top of the latest Tailwind (3.2.4) technology. `All Things Digital` shipped with Dark Mode and Mobile First Focus! This theme is designed to provide a sleek and modern look for your website, with a focus on accessibility and easy customization.

The dark mode feature allows users to switch to a darker color scheme for a more comfortable viewing experience, particularly at night or in low light environments. And with a mobile first focus, this theme is optimized for mobile devices, ensuring that your website looks great on any screen size.

Tailwind CSS is a utility-first CSS framework, which means that it provides a set of low-level utility classes that make it easy to style your website without writing complex CSS code. This allows you to quickly and easily customize the look and feel of your website to match your brand and aesthetic.

Whether you're a seasoned web developer or a beginner, this theme is sure to provide a professional and modern look for your website. Try it out today!

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

## 🤓 How To

Install dependencies (Tailwind)

```
npm install
```

Run the Tailwind CLI to compile the **input.css** during development. The output file is **dist/output.css**

- `main.css`  located at `./src/main.css`
- `style.css` located at `./dist/style.css`


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
