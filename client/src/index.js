import React, { useRef, useState } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserMultiFormatReader } from "@zxing/library";
import { useEffect } from 'react';
import { sendHttpRequest } from './utils';

const App = () => {
  const videoRef = useRef(null);
  const codeReader = new BrowserMultiFormatReader();
  const [scannedData, setScannedData] = useState("");

  useEffect(() => {
    sendHttpRequest('GET', '/api/registrants', true)
        .then(res => {
            if (res.error) {
                console.error(res.error)
            } else {
                console.log(res.data)
            }
        })
        .catch(err => {
            console.error(err)
        })
}, [])

  const handleScan = () => {
    console.log("handling scan")
    codeReader.decodeFromVideo("video")
      .then(result => {
        setScannedData(result.text);
      })
      .catch(err => {
        console.error("Error scanning barcode:", err);
      });
  };

  // Start the video stream and scan for barcodes when the component mounts
  React.useEffect(() => {
    const constraints = {
      video: { facingMode: "environment" }, // Use rear camera (if available) for better barcode scanning in mobile devices
      // audio: false,
    };

    // navigator.mediaDevices.getUserMedia(constraints)
    //   .then(stream => {
    //     videoRef.current.srcObject = stream;
    //     handleScan();
    //   })
    //   .catch(err => {
    //     console.error("Error accessing camera:", err);
    //   });
      
  });

  return (
    <div>
      <video
        ref={videoRef}
        id="video"
        autoPlay
        playsInline
        style={{ width: "300px", maxWidth: "300px" }}
      />
      <p>Scanned Data: {scannedData}</p>
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);