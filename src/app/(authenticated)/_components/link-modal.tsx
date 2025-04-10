import { ClipboardIcon } from '@heroicons/react/24/outline'
import { Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Tooltip } from '@heroui/react'

export type PasteLinkModalProperties = {
  link: null | string;
  onClose: () => void;
}

const PasteLinkModal: React.FC<PasteLinkModalProperties> = ({ link, onClose }) => {
  const pasteToClipboard = () => {
    if (link) {
      navigator.clipboard.writeText(link)
      onClose()
    }
  }

  return (
    <Modal backdrop='blur' isOpen={link !== null} onClose={onClose} size='lg'>
      <ModalContent>
        {() => (
          <>
            <ModalHeader>
              <span>Published 🎉</span>
            </ModalHeader>
            <ModalBody className='flex flex-col gap-8'>
              <Input
                aria-label='Link to the paste'
                autoFocus
                className='w-full text-xl'
                endContent={
                  <>
                    <Tooltip content='Copy' showArrow>
                      <ClipboardIcon className='w-5 h-5 cursor-pointer' onClick={pasteToClipboard} />
                    </Tooltip>
                  </>
                }
                fullWidth
                // Close modal on copy
                onCopy={onClose}
                // Select the entire input value on focus
                onFocus={event => event.target.select()}
                radius='sm'
                readOnly
                size='lg'
                value={link as string}
              />
            </ModalBody>
            <ModalFooter />
          </>
        )}
      </ModalContent>
    </Modal>
  )
}

export default PasteLinkModal
