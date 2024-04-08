import React, { useMemo } from 'react';

class PeerService {
    peer: RTCPeerConnection | null;
    constructor() {
            this.peer = new RTCPeerConnection({
                iceServers: [
                    {
                        urls: [
                            "stun:stun2.1.google.com:19302",
                            "stun:stun.l.google.com:19302",
                        ]
                    }
                ],
                iceCandidatePoolSize: 10
            })
    }

    async getAnswer({offer}: {offer: RTCSessionDescriptionInit}){
        if(this.peer) {
            await this.peer.setRemoteDescription(offer);
            const answer = await this.peer.createAnswer();
            await this.peer.setLocalDescription(new RTCSessionDescription(answer));
            return answer;
        }
    }

    async setLocalDescription(ans: RTCSessionDescription){
        if(this.peer) {
            await this.peer.setRemoteDescription(new RTCSessionDescription(ans));
        }
    }

    async createOffer() {
        if(this.peer) {
            const offer = await this.peer.createOffer();
            await this.peer.setLocalDescription(new RTCSessionDescription(offer));
            return offer;
        }
    }
}

const peerService = new PeerService();

export { peerService};