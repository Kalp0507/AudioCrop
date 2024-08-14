import { useEffect, useState } from "react";
import { StreamChat, TokenOrProvider, User } from "stream-chat";

export type UseClientoptions = {
    apiKey: string;
    user: User;
    tokenOrProvider: TokenOrProvider;
};

export const useClient = ({
    apiKey,
    user,
    tokenOrProvider,
    }: UseClientoptions): StreamChat | undefined => {
        const [chatClient,setChatClient] = useState<StreamChat>();

        useEffect(()=>{
            const client = new StreamChat(apiKey);
            let didUserConnectInterupt = false;

            const connectionPromise = client
            .connectUser(user,tokenOrProvider)
            .then(() => {
                if (!didUserConnectInterupt) {
                    setChatClient(client);
                }
            });

            return ()=>{
                didUserConnectInterupt = true;
                setChatClient(undefined);

                connectionPromise
                .then(()=>client.disconnectUser())
                .then(()=>{
                    console.log('Disconnected from chat');
                });
            };
        },[apiKey,user.id,tokenOrProvider]);

        return chatClient;
    }