import React from 'react'
import Button from '../shared/button'

const Dropdown = () => {
  return (
    <nav className='absolute select-none bg-white z-100 inset'>
      <div className='grid grid-cols-3'>
        <Button type='button'>
          Light
        </Button>
        <Button>
          Dark
        </Button>
        <Button>
          System
        </Button>
      </div>
      <ul>
        </ul>
    </nav>
  )
}

export default Dropdown