'use client'

import { greeting } from '@/backend/actions/paste'
import { EyeSlashIcon, LockClosedIcon } from '@heroicons/react/24/outline'
import { Button, Checkbox, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Select, SelectItem } from '@heroui/react'

export interface AdvancedOptionsModalProperties {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
};

const AdvancedOptionsModal: React.FC<AdvancedOptionsModalProperties> = ({ isOpen, onClose, onConfirm }) => {
  const confirm = () => {
    onConfirm()
    greeting().then(c => console.log(c))
  }

  return (
    <Modal backdrop='blur' isOpen={isOpen} onClose={onClose} size='lg'>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader>
              <span>Advanced Publish</span>
            </ModalHeader>
            <ModalBody className='flex flex-col gap-8'>
              <section className='flex flex-col gap-4'>
                <header>
                  <h3 className='font-bold text-xl'>Security</h3>
                  <p className='text-sm text-secondary-600'>
                    Enabling these options will make your Paste only viewable in browser.
                  </p>
                </header>
                <Checkbox color='secondary' icon={<EyeSlashIcon />}>
                  Only Residents can see
                </Checkbox>
                <Checkbox color='secondary' icon={<LockClosedIcon />}>
                  <span className='inline-flex gap-2 items-center'>
                    Encrypt
                  </span>
                </Checkbox>
              </section>
              <section className='flex flex-col gap-2'>
                <header>
                  <h3 className='font-bold text-xl'>Expiration</h3>
                </header>
                <Select className='max-w-xs' defaultSelectedKeys={['1h']} fullWidth placeholder='Select…'>
                  <SelectItem key='single'>After first read</SelectItem>
                  <SelectItem key='15m'>15 minutes</SelectItem>
                  <SelectItem key='1h'>Hour</SelectItem>
                  <SelectItem key='24h'>Day</SelectItem>
                  <SelectItem key='168h'>Week</SelectItem>
                  <SelectItem key='noexpiry'>Keep forever</SelectItem>
                </Select>
              </section>
            </ModalBody>
            <ModalFooter>
              <Button color='secondary' onPress={confirm}>
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
