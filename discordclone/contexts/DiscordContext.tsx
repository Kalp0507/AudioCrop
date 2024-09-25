"use client"

import { DiscordServer } from "@/models/DiscordServer";
import { createContext, useCallback, useContext, useState } from "react";
import { StreamChat } from "stream-chat";
import { v4 as uuid } from 'uuid';

type DiscordState = {
    server?: DiscordServer;
    changeServer: (server: DiscordServer | undefined, client: StreamChat)=> void;
    createServer: (
        client: StreamChat,
        name: string,
        imageUrl: string,
        userIds: string[]
    ) => void
};

const initialValue: DiscordState = {
    server: undefined,
    changeServer: () => {},
    createServer:()=>{},
};
const DiscordContext = createContext<DiscordState>(initialValue);

export const DiscordContextProvider: any = ({ children }:{ children: React.ReactNode })=>{
    const [myState,setMyState] = useState<DiscordState>();
    const changeServer = useCallback(
        async (server: DiscordServer | undefined, client: StreamChat)=> {
            setMyState((myState) => {
                return {...myState,server};
            })
        }
    ,[setMyState]);

    const createServer = useCallback(
        async (
            client: StreamChat,
            name: string,
            imageUrl: string,
            userIds: string[]
        )=>{
            const serverId = uuid();
            const messagingChannel = client.channel('messaging',uuid(),{
                name:'welcome',
                members:userIds,
                data:{
                    image:imageUrl,
                    serverId:serverId,
                    server:name,
                    category:'Text Channels'
                }
            });

            try {
                const res = await messagingChannel.create();
                console.log('[DiscordContext - createServer] Response:',res);
            } catch (err) {
                console.log( '[DiscordContext - createServer] Error:',err);
            }
        },[]
    )

    const store: DiscordState = {
        server: myState?.server,
        changeServer: changeServer,
        createServer: createServer,
    };

    return (
        <DiscordContext.Provider value={store}>{children}</DiscordContext.Provider>
    )
};

export const useDiscordContext = () => useContext( DiscordContext );