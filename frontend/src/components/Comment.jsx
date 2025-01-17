import { Avatar } from '@mui/material'
import React from 'react'




const Comment = ({ comment }) => {

    
  return (
      <div className='my-4'>
          <div className='flex gap-2 items-center'>
              
              <Avatar sx={{ height: '25px', width: '25px' }} src={comment?.author?.profilePicture} />
              <h1 className='font-semibold text-sm'>{comment?.author?.username || comment?.author?.name}</h1>
              <span>{ comment?.text }</span>\
          </div>
      
    </div>
  )
}

export default Comment
