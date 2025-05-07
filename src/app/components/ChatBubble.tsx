import React from 'react'
import Image from 'next/image'

type Props = {
    message: string;
    sender: {
        id: string;
        name: string;
        image: string;
    };
    timestamp: string;
    isMine: boolean;
}

const ChatBubble = (props: Props) => {
  return (
    <div className={`flex ${props.isMine ? 'justify-end' : 'justify-start'} mb-4`}>
        <div className={`max-w-xs p-3 rounded-lg ${props.isMine ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'}`}>
            <div className="flex items-center">
            {!props.isMine && props.sender.image && (
                <Image width={25} height={25} src={props.sender.image} alt={props.sender.name} className="w-8 h-8 rounded-full mr-2" />
            )}
            <span className="font-semibold">{props.sender.name}</span>
            </div>
            <p>{props.message}</p>
            <span className="text-xs text-gray-200">{new Date(props.timestamp).toLocaleDateString() + " " + new Date(props.timestamp).toLocaleTimeString()}</span>
        </div>
    </div>
  )
}

export default ChatBubble