'use client'

import { Button, RadioCard, Dialog, Portal, } from '@chakra-ui/react'
import { useRouter } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from "../store/store";
import { setShowModal } from "../store/features/desktopSlice";


export default function DefaultModal() {
    const dispatch = useDispatch();

    const isModlaOpen = useSelector((state: RootState) => state.desktop.showModal);

    const router = useRouter();

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
                        <Dialog.Header>
                            {/* <Dialog.Title>Before we start</Dialog.Title> */}
                        </Dialog.Header>
                        <Dialog.Body
                            className='flex items-center justify-center'
                        >
                            <RadioCard.Root
                                orientation="vertical"
                                align="center"
                                maxW="400px"
                                defaultValue="technician"
                                className="flex flex-col w-full items-stretch gap-4"
                            >
                                <RadioCard.Label className="text-center">Are you the technician?</RadioCard.Label>

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
                            <Button onClick={() => dispatch(setShowModal(false))} colorPalette='teal' variant='outline'>Save</Button>
                        </Dialog.Footer>
                    </Dialog.Content>
                </Dialog.Positioner>
            </Portal>
        </Dialog.Root>
    )
}
