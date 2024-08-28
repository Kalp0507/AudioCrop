import { UserObject } from "@/models/UserObject";
import Image from "next/image";
import { PersonIcon } from "./Icons";

export default function UserRow({
    user,
    userChanged
}:{
    user: UserObject;
    userChanged: (user: UserObject, checked: boolean)=> void;
}) {
    return (
        <div className="flex items-center justify-start w-full space-x-4 my-2">
            <input type="checkbox"
                id={user.id}
                name={user.id}
                className="w-4 h-4 mb-0"
                onChange={(e)=>{
                    userChanged(user,e.target.checked)
                }}
            />
            <label htmlFor="users" className="w-full flex items-center space-x-6">
                {user.image && (
                    <Image
                        src={user.image}
                        width={40}
                        height={40}
                        className="rounded-full w-8 h-8"
                        alt={user.name}
                    />
                )}
                {!user.image && <PersonIcon/>}
                <p>
                    <span className="block text-gray-600">{user.name}</span>
                    {user.lastOnline && (
                        <span className="text-gray-400 text-sm">Las Online: {user.lastOnline.split('T')[0]}</span>
                    )}
                </p>
            </label>
        </div>
    )
};
