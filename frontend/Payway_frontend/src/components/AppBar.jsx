import React from 'react'

function AppBar() {
  return (
    <>
    
      <div className='flex flex-col justify-center h-full ml-4'>
        PayWay App
      </div>
      <div className='flex'>
        <div className='flex flex-col justify-center h-full mr-4'>
          Hello
        </div>
        <div className='rounded-full h-12 w-12 bg-slate-200 flex justify-center mt-1 mr-2'>
          <div className='flex flex-col justify-center h-full text-xl'>
            You
          </div>
        </div>
      </div>
    </>
  )
}

export default AppBar
