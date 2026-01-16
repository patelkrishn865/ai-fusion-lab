import { Progress } from '@/components/ui/progress'
import React from 'react'

function UsageCreditProgress({ remainingToken }) {
  return (
    <div className='flex items-center flex-col gap-2 p-3 border rounded-2xl mb-5'>
        <h2 className='font-bold text-xl'>Free Plan</h2>
        <p className='text-gray-400'>{10 - remainingToken}/10 message Used</p>
        <Progress value={100 - ((10 - remainingToken) / 10) * 100} />
    </div>
  )
}

export default UsageCreditProgress