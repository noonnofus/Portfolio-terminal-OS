# My personal website: Terminal/OS style portfolio
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)  

![Next JS](https://img.shields.io/badge/Next-black?style=for-the-badge&logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![Redux](https://img.shields.io/badge/redux-%23593d88.svg?style=for-the-badge&logo=redux&logoColor=white)
![Chakra](https://img.shields.io/badge/chakra-%234ED1C5.svg?style=for-the-badge&logo=chakraui&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Vercel](https://img.shields.io/badge/vercel-%23000000.svg?style=for-the-badge&logo=vercel&logoColor=white)

## 🌐 Demo  
🔗 **Live Website:** [Go to Website](https://hyunho.vercel.app/)

## 📜 Description  
This project is a portfolio website designed with a terminal and OS-style interface. It is built with **Next.js 16, React 19, TypeScript, Zustand, and Tailwind CSS**, with **xterm.js** powering the terminal experience.

### 🚀 **Planned Features**  
- Add OS-like built-in applications (e.g., web browser, file manager)  
- Improve animations and window management  
- Implement more customizable themes  

## 📸 Screenshots  
![Website Screenshot](./public/images/Terminal-view.png)
![Website Screenshot](./public/images/OS-view.png)

## 🛠️ Tech Stack  
- **Frontend:** Next.js, React, TypeScript, Tailwind CSS
- **State Management:** Zustand
- **UI Libraries:** framer-motion, Radix UI primitives
- **Terminal Emulator:** xterm.js

## ✅ Verification Gates

Run these commands before treating a refactor as complete:

```bash
npm test
npm run lint
npx tsc --noEmit --pretty false
npm run build
```

Recommended order:

1. `npm test`
2. `npm run lint`
3. `npx tsc --noEmit --pretty false`
4. `npm run build`

Current meaning of each gate:

- `npm test`: runs core unit tests with Vitest
- `npm run lint`: runs ESLint with the Next.js 16 flat config baseline
- `npx tsc --noEmit --pretty false`: runs standalone TypeScript validation
- `npm run build`: runs the production build including Next.js TypeScript validation

## 📦 Installation  
```bash
# Clone this repository
git clone https://github.com/BCITKevin/Portfolio-terminal-OS.git

# Change directory
cd Portfolio-terminal-OS

# Install dependencies
npm install

# Start the server
npm run dev
```

## 🧪 Local Commands

```bash
npm run dev
npm test
npm run lint
npx tsc --noEmit --pretty false
npm run build
```

## License
This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.















