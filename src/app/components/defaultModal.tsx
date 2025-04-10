'use client'

import { Button, RadioCard, Dialog, Portal, } from '@chakra-ui/react'
import { useRouter } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from "../store/store";
import { setShowModal, setUserRole } from "../store/features/desktopSlice";
import { useState } from 'react';


export default function DefaultModal() {
    const [role, setRole] = useState("technician");

    const dispatch = useDispatch();
    const router = useRouter();

    const isModlaOpen = useSelector((state: RootState) => state.desktop.showModal);

    const handleRadio = () => {
        dispatch(setShowModal(false))
        dispatch(setUserRole(role))
        if (role === 'non-technician') {
            router.push('/gui');
        }
    }

    return (
        <Dialog.Root
            open={isModlaOpen}
            placement="center"
            closeOnInteractOutside={false}
            onOpenChange={() => dispatch(setShowModal(!isModlaOpen))}
        >
            <Portal>
                <Dialog.Backdrop />
                <Dialog.Positioner>
                    <Dialog.Content>
                        <Dialog.Header className='flex text-lg items-center justify-center'>
                            <Dialog.Title>Are you technician?</Dialog.Title>
                        </Dialog.Header>
                        <Dialog.Body
                            className='flex items-center justify-center'
                        >
                            <RadioCard.Root
                                value={role}
                                onChange={(e) => {
                                    const value = (e.target as HTMLInputElement).value
                                    setRole(value)
                                }}
                                orientation="vertical"
                                align="center"
                                maxW="400px"
                                defaultValue="technician"
                                className="flex flex-col w-full items-stretch gap-4"
                            >
                                <RadioCard.Item value="technician" className="w-full">
                                    <RadioCard.ItemHiddenInput />
                                    <RadioCard.ItemControl className="flex flex-col items-center justify-center w-full">
                                        <RadioCard.ItemContent className="w-full text-center">
                                            <RadioCard.ItemText>Yes, I am technician.</RadioCard.ItemText>
                                        </RadioCard.ItemContent>
                                    </RadioCard.ItemControl>
                                </RadioCard.Item>

                                <RadioCard.Item value="non-technician" className="w-full">
                                    <RadioCard.ItemHiddenInput />
                                    <RadioCard.ItemControl className="flex flex-col items-center justify-center w-full">
                                        <RadioCard.ItemContent className="w-full text-center">
                                            <RadioCard.ItemText>No, I'm not.</RadioCard.ItemText>
                                        </RadioCard.ItemContent>
                                    </RadioCard.ItemControl>
                                </RadioCard.Item>
                            </RadioCard.Root>
                        </Dialog.Body>

                        <Dialog.Footer>
                            <Button onClick={handleRadio} colorPalette='teal' variant='outline'>Submit</Button>
                        </Dialog.Footer>
                    </Dialog.Content>
                </Dialog.Positioner>
            </Portal>
        </Dialog.Root>
    )
}
