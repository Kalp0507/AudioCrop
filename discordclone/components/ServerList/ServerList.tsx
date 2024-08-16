import { DiscordServer } from "@/models/DiscordServer";
import Image from "next/image";
import { useState } from "react";
import { v4 as uuid } from 'uuid';

export default function ServerList():JSX.Element{
    const [activeServer,setActiveServer]=useState<DiscordServer|undefined>()
    const servers: DiscordServer[] = [
        {
            id: '1',
            name:'Test Server 1',
            image:'https://images.unsplash.com/photo-1518770660439-4636190af475?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8dGVjaG5vbG9neXxlbnwwfHwwfHx8MA%3D%3D'
        },
        {
            id: '2',
            name:'Test Server 2',
            image:'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8dGVjaG5vbG9neXxlbnwwfHwwfHx8MA%3D%3D'
        },
        {
            id: '3',
            name:'Test Server 3',
            image:'https://images.unsplash.com/photo-1483058712412-4245e9b90334?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjZ8fHRlY2hub2xvZ3l8ZW58MHx8MHx8fDA%3D'
        },
    ]

    function checkIfUrl(path:string):Boolean {
        try {
            const _ = new URL(path);
            return true;
        } catch (_) {
            return false;
        }
    }

    return (
        <div className="bg-dark-gray h-full flex flex-col items-center ">
            {servers.map((server)=>(
                <button key={server.id}
                    onClick={()=> setActiveServer(server)}
                    className={`p-1 sidebar-icon ${server.id == activeServer?.id ? "selected-icon":""}`}>
                    {server.image && checkIfUrl(server.image) ? (
                        <Image src={server.image} alt="Server Icon" width={50} height={50} className="rounded-icon"/>
                    ): (
                        <span className="rounded-icon bg-gray-600 w-[50px] flex items-center justify-center text-sm">
                            {server.name.charAt(0)}
                        </span>
                    )}
                </button>
            ))}
        </div>
    )
}