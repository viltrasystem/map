==============Sampath ===============
npm install @vitejs/plugin-basic-ssl --save-dev => ssl local
npm i react-hook-form@7
npm i -d @hookform/devtools
npm install zod @types/zod
npm install @hookform/resolvers
npm install axios
npm install country-flag-icons
npm i i18next react-i18next i18next-browser-languagedetector eslint-plugin-i18next i18next-http-backend
npm install js-cookie @types/js-cookie
npm install @reduxjs/toolkit react-redux
npm i react-error-boundary
npm install react-icons
npm i @heroicons/react \*\*\*
npm i @heroicons/react
npm i react-popper @popperjs/core
npm list redux-thunk
npm i redux-persist
npm i @types/jsonwebtoken
npm i jwt-decode
npm install react-toastify
npm install @types/react-toastify

---

npm i immer
npm install vite-plugin-xml-loader --save-dev for xml file load

---

npm install @types/autoprefixer --save-dev
//npm install -D @tailwindcss/forms
?????????????
redux-thunk, immer
jwt-decode @types/jwt-decode \*\*\*\* need to install
https://codesandbox.io/p/sandbox/uniswap-info-ixowl -- example of good react-popper

// typescript configure in project \* check and use /////////////////////
npm install typescript @types/react @types/react-dom --save-dev.
npm install @typescript-eslint/eslint-plugin --save-dev.
npm install @typescript-eslint/parser --save-dev.
///////////////////////////////
==============Sampath================

# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default {
  // other rules...
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    project: ["./tsconfig.json", "./tsconfig.node.json"],
    tsconfigRootDir: __dirname,
  },
};
```

- Replace `plugin:@typescript-eslint/recommended` to `plugin:@typescript-eslint/recommended-type-checked` or `plugin:@typescript-eslint/strict-type-checked`
- Optionally add `plugin:@typescript-eslint/stylistic-type-checked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and add `plugin:react/recommended` & `plugin:react/jsx-runtime` to the `extends` list
