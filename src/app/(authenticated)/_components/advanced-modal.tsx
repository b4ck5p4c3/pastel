'use client'

import { PasteExpiration } from '@/backend/actions/paste/types'
import { Button, Checkbox, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Select, SelectItem } from '@heroui/react'
import { useState } from 'react'

import { PasteOptions } from './types'

export interface AdvancedOptionsModalProperties {
  isAvailable: boolean
  isOpen: boolean
  onClose: () => void
  onConfirm: (properties: PasteOptions) => Promise<void>
};

const AdvancedOptionsModal: React.FC<AdvancedOptionsModalProperties> = ({
  isAvailable,
  isOpen,
  onClose,
  onConfirm
}) => {
  const [expiration, setExpiration] = useState<PasteExpiration>(PasteExpiration.OneDay)
  const [shouldEncrypt, setShouldEncrypt] = useState<boolean>(false)
  const [residentsOnly, setResidentsOnly] = useState<boolean>(false)
  const [isUiLoading, setUiLoading] = useState<boolean>(false)

  const confirm = async () => {
    setUiLoading(true)
    await onConfirm({
      encrypt: shouldEncrypt,
      expiration,
      onlyResidents: residentsOnly
    })

    // Reset state
    setExpiration(PasteExpiration.OneDay)
    setShouldEncrypt(false)
    setResidentsOnly(false)
    setUiLoading(false)

    onClose()
  }

  return (
    <Modal backdrop='blur' isDismissable={!isUiLoading} isOpen={isOpen} onClose={onClose} size='lg'>
      <ModalContent>
        {() => (
          <>
            <ModalHeader>
              <span>Advanced Publish</span>
            </ModalHeader>
            <ModalBody className='flex flex-col gap-8'>
              <section className='flex flex-col gap-2'>
                <header>
                  <h3 className='font-bold text-xl'>Expiration</h3>
                </header>
                <Select
                  aria-label='Time in which the paste will be destroyed'
                  className='max-w-xs'
                  disabled={isUiLoading}
                  onSelectionChange={s => setExpiration(s.currentKey as PasteExpiration)}
                  placeholder='Select…'
                  selectedKeys={[expiration]}
                >
                  <SelectItem aria-label='Destroy paste after first read' key={PasteExpiration.AfterFirstRead}>After first read</SelectItem>
                  <SelectItem aria-label='Destroy in 15 minutes' key={PasteExpiration.FifteenMinutes}>15 minutes</SelectItem>
                  <SelectItem aria-label='Destroy in one hour' key={PasteExpiration.OneHour}>Hour</SelectItem>
                  <SelectItem aria-label='Destroy in one day' key={PasteExpiration.OneDay}>Day</SelectItem>
                  <SelectItem aria-label='Destroy in the week' key={PasteExpiration.OneWeek}>Week</SelectItem>
                  <SelectItem aria-label='Keep this paste forever' key={PasteExpiration.Never}>Keep forever</SelectItem>
                </Select>
              </section>
              <section className='flex flex-col gap-4'>
                <header>
                  <h3 className='font-bold text-xl'>Security</h3>
                  <p className='text-sm text-secondary-600'>
                    Enabling these options will make your Paste only viewable in browser.
                  </p>
                </header>
                <Checkbox color='secondary' isDisabled={isUiLoading} isSelected={residentsOnly} onValueChange={setResidentsOnly}>
                  Only Residents can see
                </Checkbox>
                <Checkbox color='secondary' isDisabled={isUiLoading} isSelected={shouldEncrypt} onValueChange={setShouldEncrypt}>
                  Encrypt
                </Checkbox>
              </section>
            </ModalBody>
            <ModalFooter>
              <Button color='secondary' isDisabled={!isAvailable} isLoading={isUiLoading} onPress={confirm}>
                Publish
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  )
}

export default AdvancedOptionsModal
