import React from 'react'

function Balance({value}) {
  return (
    <>
    <div className='font-semibold ml-4 text-lg'>
      Your balance
    </div>
    <div className='font-semibold ml-4 text-lg'>
      Rs {value}
    </div>
    </>
  )
}

export default Balance