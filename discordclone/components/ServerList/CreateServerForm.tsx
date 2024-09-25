import Link from "next/link";
import CloseIcon from '../Icons';
import { useSearchParams , useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { UserObject } from "@/models/UserObject";
import { useChatContext } from "stream-chat-react";
import UserRow from "../UserRow";
import { useDiscordContext } from "@/contexts/DiscordContext";


type FormState = {
    serverName: string;
    serverImage: string;
    users: UserObject[];
}

export default function CreateServerForm():JSX.Element {
    //To show dialog box
    const params = useSearchParams();
    const showCreateServerForm = params.get('createServer');
    const dialogRef = useRef<HTMLDialogElement>(null);

    const router = useRouter();

    //Data
    const initialState:FormState = {
        serverName: '',
        serverImage: '',
        users: []
    };
    const [formData,setFormData] = useState<FormState>(initialState);
    const [users,setUsers] = useState<UserObject[]>([]);
    const { client } = useChatContext();
    const { createServer } = useDiscordContext();

    const loadUsers = useCallback(async ()=>{
        const res = await client.queryUsers({});
        const users: UserObject[] = res.users
            .filter((user)=> user.role !== 'admin')
            .map((user)=>{
                return {
                    id: user.id,
                    name: user.name ?? user.id,
                    image: user.image as string,
                    online: user.online,
                    lastOnline: user.last_active
                }
            });
            if(users) setUsers(users);
    },[client]);

    useEffect(()=>{
        if(showCreateServerForm && dialogRef.current){
            dialogRef.current.showModal();
        }
        else{
            dialogRef.current?.close();
        }
    },[showCreateServerForm]);

    useEffect(()=>{
        loadUsers();
    },[loadUsers])

    function userChanged(user: UserObject, checked: boolean){
        if(checked){
            setFormData({...formData,users: [...formData.users,user]})
        } else{
            setFormData({...formData,users: formData.users.filter((u)=> u.id !== user.id)})
        }
    }

    function buttonDisable(): boolean {
        return (!formData.serverName || !formData.serverImage || formData.users.length <= 1)
    }
    
    function createClicked(){
        createServer(
            client,
            formData.serverName,
            formData.serverImage,
            formData.users.map((user)=> user.id)
        )
        setFormData(initialState);
        router.replace('/');
    }

    return (
        <dialog className="absolute z-10 space-y-2 rounded-xl" ref={dialogRef}>
            <div className="w-full flex items-center justify-between py-8 px-6">
                <h2 className="text-3xl font-semibold text-gray-600">Create new server</h2>
                <Link href="/">
                    <CloseIcon className="w-8 h-8 text-gray-400"/>
                </Link>
            </div>
            <form method="dialog" className="flex flex-col space-y-2 px-6">
                <label className="labelTitle" htmlFor="serverName">Server Name</label>
                <div className="flex items-center bg-gray-100 rounded">
                    <span className="text-2xl p-2 text-gray-500">#</span>
                    <input
                        type="text"
                        id="serverName"
                        name="serverName"
                        value={formData.serverName}
                        onChange={(e)=>setFormData({...formData, serverName: e.target.value })}
                        required
                    />
                </div>
                <label className="labelTitle" htmlFor="serverImage">Server Image</label>
                <div className="flex items-center bg-gray-100 rounded">
                <span className="text-2xl p-2 text-gray-500">#</span>
                    <input
                        type="text"
                        id="serveImage"
                        name="serverImage"
                        value={formData.serverImage}
                        onChange={(e)=>setFormData({...formData, serverImage: e.target.value })}
                        required
                    />
                </div>
                <h2 className="labelTitle mb-2">Add Users</h2>
                <div className="max-h-64 overflow-y-scroll custom-scrollbar">
                    {users.map((user)=>(
                        <UserRow key={user.id} user={user} userChanged={userChanged}/>
                    ))}
                </div>
            </form>
            <div className="flex items-center justify-end space-x-6 p-6 bg-gray-300">
                <Link href={'/'} className="font-semibold text-gray-500">Cancel</Link>
                <button type="submit"
                    className={`bg-discord rounded py-2 px-4 text-white font-bold uppercase ${buttonDisable() ? 'opacity-50 cursor-not-allowed':''}`}
                    disabled={buttonDisable()}
                    onClick={createClicked}
                >
                    Create Server
                </button>
            </div>
        </dialog>
    );
}