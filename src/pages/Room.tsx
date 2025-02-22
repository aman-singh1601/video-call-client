import { useSocket } from '@/context/socketContext';
import ReactPlayer from 'react-player';
import React, { useCallback, useEffect, useState } from 'react'
import {peerService} from "@/context/Peer";
import { Button } from '@/components/ui/button';

const Room = () => {
  //@ts-ignore
  const {socket} = useSocket();

  // const [roomId, setRoomId] = useState<String | null>(null);
  const [remoteEmail, setRemoteEmail] = useState<String | null>(null);
  const [myStream, setMyStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);

  const handleCreateStream = useCallback(async ()=> {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });

    setMyStream(stream);

  },[]);

  useEffect( () => {
    handleCreateStream();
  },[]);

  // const sendStream = useCallback(async ()=> {
  //   if(myStream)
  //   for(let track of myStream?.getTracks()) {
  //       console.log("sending track: ", track);
  //       const res = peerService.peer?.addTrack(track, myStream);
  //       console.log(res);
  //   }
  // },[myStream]);
  const sendStream = () => {
    if(myStream)
    for(let track of myStream?.getTracks()) {
        console.log("sending track: ", track);
        const res = peerService.peer?.addTrack(track, myStream);
        console.log(res);
    }
  }


  //calling remote peer
  const handleNewUserJoined =  useCallback( async ({email}:{email: string}) => {
        console.log("New user joined : " + email);

        setRemoteEmail(email);

  },[]);

  const handleCallUser = useCallback( async () => {

    const offer = await peerService.createOffer();
    console.log(remoteEmail);
    socket.emit("event:call-user", {email: remoteEmail, offer});

  },[socket, remoteEmail]);

  const handleIncommingCall = useCallback(async ({email, offer}:{email: string, offer: RTCSessionDescriptionInit}) => {

    console.log("incomming call: offer ", offer);
    console.log("incomming call: email: ", email);

    setRemoteEmail(email);

    const ans = await peerService.getAnswer({offer});

    //call accepted
    socket.emit("event:call-accepted", {email, ans});
    //call declined


  },[socket]);

  const handleCallAccepted = useCallback(async ({email, ans}:{email: string, ans: RTCSessionDescription}) => {
    console.log("call accepted : answer ", ans);
    console.log("call accepted by email: ", email);
    ///error in this
    await peerService.setLocalDescription(ans);

    // sendStream();

  },[]); 

  //for negotiation..................................................

  const handleNegoNeeded = useCallback(async () => {
    const offer = await peerService.createOffer();

      console.log(" email:", remoteEmail);
      socket.emit("peer:nego:needed", {to: remoteEmail, offer});



  },[socket, remoteEmail]);

  const handleNegoIncomming = useCallback(async ({from, offer}:{from: String, offer: RTCSessionDescriptionInit}) => {
    console.log("Nego incomming", offer);
      let ans = await peerService.getAnswer({offer});
      socket.emit("peer:nego:done", {to: from, ans});
  },[socket]);

  const handleNegoDone = useCallback(async ({from, ans}:{from: String, ans: RTCSessionDescription}) => {
    console.log("nedo done", ans);
    await peerService.setLocalDescription(ans);

  },[]);


  const onTrack = useCallback((e: any) => {
    console.log("got Tracks", e.streams);
    setRemoteStream(e.streams[0]);
  } ,[]);


  useEffect(() => {
    peerService.peer?.addEventListener("negotiationneeded", handleNegoNeeded);
    peerService.peer?.addEventListener("track", onTrack)
    return () => {
      peerService.peer?.removeEventListener("negotiationneeded", handleNegoNeeded);
      peerService.peer?.addEventListener("track", onTrack)
    }
  },[handleNegoNeeded, peerService, onTrack]);



  // console.log(remoteStream);
  //for exchanging SDP
  useEffect(()=>{
    socket.on("event:user-joined", handleNewUserJoined);
    socket.on("event:incomming-call", handleIncommingCall);
    socket.on("event:accepted", handleCallAccepted);
    socket.on("peer:nego:required", handleNegoIncomming);
    socket.on("peer:nego:final", handleNegoDone);


    return () => {
      socket.off("event:user-joined", handleNewUserJoined);
      socket.off("event:incomming-call", handleIncommingCall);
      socket.off("event:accepted", handleCallAccepted);
      socket.off("peer:nego:required", handleNegoIncomming);
      socket.off("peer:nego:final", handleNegoDone);
    }
  },[socket, handleNewUserJoined, handleIncommingCall, handleCallAccepted, handleNegoDone, handleNegoIncomming]);

  return (
    <div>
      <div>
        <Button onClick={sendStream}>send Stream</Button>
        <Button onClick={handleCallUser}>Call User</Button>
      </div>
      <h3>My Stream</h3>
      {myStream && 
          <ReactPlayer
            playing
            muted
            className = "h-[300px] w-[300px]"
            url={myStream}
          />}

      { remoteStream && (
        <>
          <h3>Remote Stream</h3>
          <ReactPlayer
            playing
            muted
            className = "h-[300px] w-[300px]"
            url={remoteStream}
          />
        </>
      )
          
      }
    </div>
  )
}

export default Room;