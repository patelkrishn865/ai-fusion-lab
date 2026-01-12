import { Button } from '@/components/ui/button'
import { Mic, Paperclip, Send } from 'lucide-react'
import React from 'react'
import AiMultiModels from './AiMultiModels'

function ChatInputBox() {
  return (
    <div className='relative min-h-screen'>
        <div>
            <AiMultiModels />
        </div>
        <div className='fixed bottom-0 left-0 flex w-full justify-center px-4 pb-4'>
            <div className='w-full border rounded-xl shadow-md max-w-2xl p-4'>
                <input type='text' placeholder='Ask me anything...' className='border-0 outline-none' />
                <div className='mt-3 flex items-center justify-between'>
                    <Button variant='ghost' size='icon'>
                        <Paperclip className='h-5 w-5' />
                    </Button>
                    <div className='flex gap-5'>
                        <Button variant='ghost' size='icon'><Mic className='h-5 w-5' /></Button>
                        <Button size='icon' className='bg-blue-600'><Send className='h-5 w-5' /></Button>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default ChatInputBox