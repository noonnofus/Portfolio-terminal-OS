'use client';

import { Terminal } from 'xterm';
import { FitAddon } from '@xterm/addon-fit';
import 'xterm/css/xterm.css';
import { useEffect, useRef } from 'react';
import writeText from './write-text';
import handleInput from './handle-input';
import { useRouter, usePathname } from 'next/navigation';
import useIsTouchDevice from '@/lib/isTouchDevice';
import DefaultModal from '../components/defaultModal';
import { useSelector } from 'react-redux';
import { RootState } from "../store/store";


export default function TerminalPage() {
    const terminalRef = useRef<HTMLDivElement | null>(null);
    const term = useRef<Terminal | null>(null);
    const fitAddon = useRef<FitAddon | null>(null);
    const inputRef = useRef('');
    const isAnimating = useRef(false);
    const router = useRouter();
    const pathname = usePathname();
    const mountedRef = useRef(false);
    const isTouchDevice = useIsTouchDevice();
    const isModlaOpen = useSelector((state: RootState) => state.desktop.showModal);

    useEffect(() => {
        if (mountedRef.current) return;
        mountedRef.current = true;

        let isComponentMounted = true;
        let cleanupFn: (() => void) | undefined;

        const initializeTerminal = async () => {
            if (!terminalRef.current || !isComponentMounted) return;

            if (term.current) {
                term.current.dispose();
                term.current = null;
            }

            if (fitAddon.current) {
                fitAddon.current = null;
            }

            term.current = new Terminal({
                cursorBlink: true,
                fontSize: isTouchDevice ? 12 : 14,
                fontFamily: 'monospace',
                theme: {
                    background: '#000000',
                    foreground: '#3CD607'
                },
                allowProposedApi: true
            });

            fitAddon.current = new FitAddon();
            term.current.loadAddon(fitAddon.current);

            term.current.open(terminalRef.current);

            const handleResize = () => {
                if (!isComponentMounted) return;

                try {
                    if (fitAddon.current && term.current) {
                        fitAddon.current.fit();
                    }
                } catch (error) {
                    console.error('Error fitting terminal:', error);
                }
            };

            window.addEventListener('resize', handleResize);

            if (isComponentMounted) {
                handleResize();
                setTimeout(() => {
                    if (isComponentMounted && term.current) {
                        writeText(term, isAnimating);
                    }
                }, 100);
            }

            if (term.current) {
                term.current.onData((data) => {
                    if (!isAnimating.current && term.current && isComponentMounted) {
                        handleInput(term, inputRef, data, isAnimating, terminalRef, fitAddon, router, pathname);
                    }
                });
            }

            cleanupFn = () => {
                window.removeEventListener('resize', handleResize);
                if (term.current) {
                    term.current.dispose();
                }
            };
        };

        initializeTerminal().catch(console.error);

        return () => {
            isComponentMounted = false;
            mountedRef.current = false;

            if (cleanupFn) {
                cleanupFn();
            }

            if (term.current) {
                term.current.dispose();
                term.current = null;
            }

            if (fitAddon.current) {
                fitAddon.current = null;
            }
        };
    }, [pathname, isTouchDevice]);

    return (
        <div ref={terminalRef} style={{ height: '100%', width: '100%' }} >
            {isModlaOpen && pathname !== "/gui" ? (
                <DefaultModal />
            ) : (
                <></>
            )}
        </div>
    )

}