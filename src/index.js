import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { NextUIProvider } from "@nextui-org/system";
import { ThemeProvider as NextThemesProvider } from "next-themes";

import { createRoot } from 'react-dom/client';
const container = document.getElementById('root');
const root = createRoot(container); // createRoot(container!) if you use TypeScript

root.render(
    <NextUIProvider>
        {/* <NextThemesProvider attribute="class" defaultTheme="light"> */}
        <App />
        {/* </NextThemesProvider> */}
    </NextUIProvider>
)

// ReactDOM.render(<App />, document.getElementById('root'));