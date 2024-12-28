'use client';

import { Provider as ChakraProvider } from "@/components/ui/provider"
import { Provider } from "react-redux";
import store from "./store/store";

export default function ClientProvider({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <Provider store={store}>
            <ChakraProvider>
                {children}
            </ChakraProvider>
        </Provider>
    );
}