'use client'

import {
  Avatar,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownSection,
  DropdownTrigger,
  Link as HeroLink,
  Navbar as HeroNavbar,
  NavbarBrand,
  NavbarContent,
  User,
} from '@heroui/react'
import Link from 'next/link'
import { signOut, useSession } from 'next-auth/react'
import { Key } from 'react'

const handleAction = (action: Key) => {
  switch (action) {
    case 'signout': {
      signOut()
      break
    }
  }
}

const AvatarTrigger: React.FC<{ image: null | string, name: string }> = ({ image, name }) => {
  if (image) {
    return (
      <Avatar
        color='secondary'
        isBordered
        name={name}
        showFallback
        size='sm'
        src={image}
      />
    )
  }

  return (
    <Avatar
      color='secondary'
      isBordered
      name={name}
      size='sm'
    />
  )
}

function NavbarUserMenu () {
  const session = useSession()
  const user = session.data?.user

  if (!user) {
    return null
  }

  return (
    <Dropdown backdrop='blur' placement='bottom-end'>
      <DropdownTrigger className='cursor-pointer'>
        <AvatarTrigger image={user.image} name={user.name} />
      </DropdownTrigger>
      <DropdownMenu
        aria-label='Profile Actions'
        disabledKeys={['details']}
        itemClasses={{
          base: [
            'text-default-500',
            'transition-opacity',
            'data-[hover=true]:bg-default-100',
            'dark:data-[hover=true]:bg-default-50',
            'data-[selectable=true]:focus:bg-default-50',
            'data-[pressed=true]:opacity-70',
            'data-[focus-visible=true]:ring-default-500',
          ],
        }}
        onAction={handleAction}
        variant='flat'
      >
        <DropdownSection aria-label='Profile & Actions' showDivider>
          <DropdownItem className='h-14 gap-2 opacity-100' isReadOnly key='details'>
            <User
              avatarProps={user.image
                ? {
                    size: 'sm',
                    src: user.image,
                  }
                : {}}
              classNames={{
                description: 'text-default-500',
                name: 'text-default-600',
              }}
              description={`@${user.username}`}
              name={user.name}
            />
          </DropdownItem>
        </DropdownSection>
        <DropdownItem color='danger' key='signout'>
          Sign out
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  )
}

export default function Navbar () {
  return (
    <HeroNavbar disableAnimation isBordered>
      {/* Branding */}
      <NavbarContent justify='start'>
        <NavbarBrand role='banner'>
          <HeroLink
            aria-label='Go to "New Paste" page'
            as={Link}
            className='font-extrabold font-serif text-3xl text-foreground -mt-1.5r'
            href='/'
          >
            Pastel
            <sup className='text-sm ml-2'>β</sup>
          </HeroLink>
        </NavbarBrand>
      </NavbarContent>

      {/* User menu dropdown */}
      <NavbarContent className='items-center' justify='end'>
        <NavbarUserMenu />
      </NavbarContent>
    </HeroNavbar>
  )
}
