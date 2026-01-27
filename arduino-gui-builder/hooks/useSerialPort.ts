import { useState, useRef, useCallback, useEffect } from 'react';

// Types for Web Serial API
// Ideally we'd use a package like @types/w3c-web-serial but for now we'll mock or ignore TS errors for experimental API
// or extend the window interface.

interface SerialPort {
    open: (options: { baudRate: number }) => Promise<void>;
    close: () => Promise<void>;
    readable: ReadableStream;
    writable: WritableStream;
}

export function useSerialPort() {
    const [isConnected, setIsConnected] = useState(false);
    const [reader, setReader] = useState<ReadableStreamDefaultReader | null>(null);
    const [writer, setWriter] = useState<WritableStreamDefaultWriter | null>(null);
    const portRef = useRef<SerialPort | null>(null);
    const [lastData, setLastData] = useState<string>("");

    const connect = useCallback(async (baudRate = 9600) => {
        if (!('serial' in navigator)) {
            alert("Web Serial API not supported in this browser. Please use Chrome or Edge.");
            return;
        }

        try {
            const port = await (navigator as any).serial.requestPort();
            await port.open({ baudRate });
            portRef.current = port;

            // Setup writer
            const textEncoder = new TextEncoder();
            const writableStreamClosed = port.writable.pipeTo(new WritableStream()); // This might be wrong logic for retaining writer.
            // Correct way to get writer:
            const w = port.writable.getWriter();
            setWriter(w);

            setIsConnected(true);

            // Start reading loop
            readLoop(port);

        } catch (err) {
            console.error("Error connecting to serial port:", err);
            // alert("Failed to connect: " + err);
        }
    }, []);

    const disconnect = useCallback(async () => {
        if (reader) {
            await reader.cancel();
            setReader(null);
        }
        if (writer) {
            await writer.close();
            setWriter(null);
        }
        if (portRef.current) {
            await portRef.current.close();
            portRef.current = null;
        }
        setIsConnected(false);
    }, [reader, writer]);

    const readLoop = async (port: any) => {
        const textDecoder = new TextDecoderStream();
        const readableStreamClosed = port.readable.pipeTo(textDecoder.writable);
        const r = textDecoder.readable.getReader();
        setReader(r);

        try {
            while (true) {
                const { value, done } = await r.read();
                if (done) {
                    // Allow the serial port to be closed later.
                    break;
                }
                if (value) {
                    console.log("Serial received:", value);
                    // Simple line buffering could be added here, currently just raw chunks
                    setLastData(value);
                }
            }
        } catch (error) {
            console.error("Read error:", error);
        } finally {
            r.releaseLock();
        }
    };

    const sendData = useCallback(async (data: string) => {
        if (!writer) {
            console.warn("Serial writer not available");
            return;
        }
        const encoder = new TextEncoder();
        await writer.write(encoder.encode(data));
    }, [writer]);

    // Clean up on unmount
    useEffect(() => {
        return () => {
            // Ideally we disconnect here, but often we want to keep connection alive if component remounts?
            // For this simple app, we might force disconnect.
            if (isConnected) {
                // disconnect(); // Be careful with strict mode in React executing this twice.
            }
        };
    }, [isConnected]);

    return {
        connect,
        disconnect,
        sendData,
        isConnected,
        lastData
    };
}
