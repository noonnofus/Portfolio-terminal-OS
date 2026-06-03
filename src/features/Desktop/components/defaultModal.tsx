'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { useDesktopStore } from '@/features/Desktop/store/useDesktopStore'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/shared/ui/shadcn-dialog'
import { RadioGroup, RadioGroupItem } from '@/shared/ui/shadcn-radio-group'
import { Button } from '@/shared/ui/shadcn-button'
import { Label } from '@radix-ui/react-label'

export default function DefaultModal() {
  const [role, setRole] = React.useState('technician')
  const router = useRouter()

  const isModalOpen = useDesktopStore((state) => state.showModal)
  const setShowModal = useDesktopStore((state) => state.setShowModal)
  const setUserRole = useDesktopStore((state) => state.setUserRole)

  const handleRadio = () => {
    setShowModal(false)
    setUserRole(role)
    if (role === 'non-technician') {
      router.push('/gui')
    }
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={setShowModal}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-bold">
            Are you technician?
          </DialogTitle>
        </DialogHeader>
        <div className="py-6">
          <RadioGroup
            value={role}
            onValueChange={setRole}
            className="flex flex-col gap-4"
          >
            <div
              className={`flex items-center space-x-3 rounded-pen-lg border p-4 transition-colors cursor-pointer ${
                role === 'technician'
                  ? 'border-primary bg-accent/50'
                  : 'border-border hover:bg-accent/30'
              }`}
              onClick={() => setRole('technician')}
            >
              <RadioGroupItem value="technician" id="technician" />
              <Label
                htmlFor="technician"
                className="flex-1 cursor-pointer font-medium"
              >
                Yes, I am technician.
              </Label>
            </div>
            <div
              className={`flex items-center space-x-3 rounded-pen-lg border p-4 transition-colors cursor-pointer ${
                role === 'non-technician'
                  ? 'border-primary bg-accent/50'
                  : 'border-border hover:bg-accent/30'
              }`}
              onClick={() => setRole('non-technician')}
            >
              <RadioGroupItem
                value="non-technician"
                id="non-technician"
              />
              <Label
                htmlFor="non-technician"
                className="flex-1 cursor-pointer font-medium"
              >
                No, I&apos;m not.
              </Label>
            </div>
          </RadioGroup>
        </div>
        <DialogFooter className="sm:justify-center">
          <Button
            onClick={handleRadio}
            variant="outline"
            className="w-full sm:w-32"
          >
            Submit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
