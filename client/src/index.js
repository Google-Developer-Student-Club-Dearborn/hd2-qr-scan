import React, { useRef, useState } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserMultiFormatReader } from "@zxing/library";
import { useEffect } from 'react';
import { sendHttpRequest } from './utils';

import "./style.css"

const App = () => {
  const videoRef = useRef(null);
  const codeReader = new BrowserMultiFormatReader();
  const [scannedData, setScannedData] = useState("+1248870620");

  const [result, setResult] = useState(null)
  const [resultOpened, setResultOpened] = useState(false)
  const [resultLoading, setResultLoading] = useState(false)


  const handleScan = () => {
    console.log("handling scan")
    codeReader.decodeFromVideo("video")
      .then(result => {
        setResultOpened(true)
        setScannedData(result.text);
      })
      .catch(err => {
        console.error("Error scanning barcode:", err);
      });
  };

  const getUserMedia = () => {
    const constraints = {
      video: { facingMode: "environment" }, // Use rear camera (if available) for better barcode scanning in mobile devices
      // audio: false,
    };

    navigator.mediaDevices.getUserMedia(constraints)
      .then(stream => {
        videoRef.current.srcObject = stream;
        handleScan();
      })
      .catch(err => {
        console.error("Error accessing camera:", err);
      });
  }

  // Start the video stream and scan for barcodes when the component mounts
  React.useEffect(() => {
    // getUserMedia()
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

      {!resultOpened && <button onClick={() => {
        setResultOpened(true)
        sendHttpRequest('GET', `/api/registrant?phone_number=${encodeURIComponent(scannedData)}`, true)
          .then(res => {
            if (res.error) {
              console.error(res.error)
            } else {
              setResult(res.data)
            }
          })
          .catch(err => {
            console.error(err)
          })
          .finally(() => {
            setResultLoading(false)
          })
      }}>open</button>}

      {resultOpened && <div>
        
        {resultLoading && <>loading result: {scannedData}</>}

        {!resultLoading && <pre>{JSON.stringify(result)}</pre>}

        {!resultLoading && <button onClick={() => {
          setResultOpened(false)
        }}>close</button>}

        {!resultLoading && <button onClick={() => {
        }}>attend</button>}

        {!resultLoading && <button onClick={() => {

        }}>raffle</button>}
      </div>}
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);