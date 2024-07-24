import { useState,useEffect,useRef,useCallback } from "react";

const useWebSocket = (url:string)=>{
    const [messages,setMessages] = useState<any[]>([])
    const [isConnected,setIsConnected] = useState(false)
    const socketRef = useRef<WebSocket | null >(null)

    useEffect(()=>{
        socketRef.current = new WebSocket(url)

        socketRef.current.onopen = () => {
            setIsConnected(true);
            console.log('WebSocket connection established');
        };
        socketRef.current.onclose = ()=>{
            setIsConnected(false)
            console.log('Web socket connection closed')
        }
        socketRef.current.onmessage = (event)=>{
            const message = JSON.parse(event.data)
            setMessages((prevMessages)=>[...prevMessages,message])
        }
        socketRef.current.onerror = (error)=>{
            console.log('Web socket error',error)
        }
        
        return () => {
            socketRef.current?.close();
        };
        
    }, [url]);

    const sendMessage = useCallback((message:any)=>{
        if(socketRef.current?.readyState === WebSocket.OPEN){
            socketRef.current.send(JSON.stringify(message))
        }else{
            console.log('websocket is not open')
        }
    },[])

    return {messages,sendMessage,isConnected}
}

export default useWebSocket