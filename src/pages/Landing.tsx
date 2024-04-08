import { useEffect, useState } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useSocket } from "@/context/socketContext";
import { useNavigate } from "react-router-dom";

const Landing = () => {
    const navigate = useNavigate();
    //@ts-ignore
    const { socket} = useSocket();

    const [email, setEmail] = useState<string | null>(null);
    const [roomid, setRoomid] = useState<string | null>(null);


    const handleSubmit = () => {
        const data = {
            email,
            roomid,
        }
        socket.emit("event:join-room", data);
    }
    const handleJoinedRoom = ({roomid}:{roomid: string}) => {
        console.log("roomid : " + roomid);
        navigate(`/${roomid}`);
    }
    useEffect(() => {
        socket.on("event:joined-room", handleJoinedRoom);
    }, [socket]);


    return (
        <div className="">
            <Card className=" w-[450px] m-auto mt-[15%]">
                <CardHeader>
                    <CardTitle>Link Up</CardTitle>
                    <CardDescription>
                        Create Room to start a video call
                    </CardDescription>
                </CardHeader>
                <CardContent className='flex flex-col '>
                    <form>
                        <div className="grid w-full items-center gap-4">
                            <div className="flex flex-col items-start space-y-1.5">
                                <Label htmlFor="name">Email</Label>
                                <Input id="email" onChange={(e) => setEmail(e.target.value)} placeholder="example@gmail.com" />
                            </div>
                            <div className="flex flex-col items-start space-y-1.5">
                                <Label htmlFor="framework">Room Name</Label>
                                <Input id="roomid" onChange={(e) => setRoomid(e.target.value)} placeholder="loremipsum" />
                            </div>
                        </div>
                    </form>
                </CardContent>
                <CardFooter>
                    <div className="">
                    <Button onClick={handleSubmit}>Create</Button>
                    </div>
                </CardFooter>
            </Card>
            
        </div>
    )
}

export default Landing;