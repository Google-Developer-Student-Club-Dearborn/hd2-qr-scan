import React, { useRef, useState } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserMultiFormatReader } from "@zxing/library";
import { useEffect } from 'react';
import { sendHttpRequest } from './utils';
import Button from '@mui/material/Button';

import "./global.css"
import style from "./style.module.css"
import { Card, Typography } from '@mui/material';

const App = () => {
  const videoRef = useRef(null);
  const codeReader = new BrowserMultiFormatReader();

  const [scannedData, setScannedData] = useState(null);
  const [result, setResult] = useState(null)
  const [resultOpened, setResultOpened] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleScan = () => {
    codeReader.decodeFromVideo("video")
      .then(result => {
        setScannedData(result.text);
        openResult()
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

  const openResult = () => {
    setResultOpened(true)
    setLoading(true)
    setResult(null)
    sendHttpRequest('GET', `/api/registrant?phone_number=${encodeURIComponent(scannedData)}`, true)
      .then(res => {
        if (res.error) {
          alert(`Error getting data: ${scannedData}`)
          setResultOpened(false)
          setResult(null)
          setScannedData(null)
          console.error(res.error)
        } else {
          setResult(res.data)
        }
      })
      .catch(err => {
        console.error(err)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  const attendRegistrant = () => {
    sendHttpRequest('POST', `/api/attend?phone_number=${encodeURIComponent(scannedData)}`, true)
      .then(res => {
        if (res.error) {
          console.error(res.error)
        } else {
          // setResult(res.data)
          console.log(res.data)
        }
      })
      .catch(err => {
        console.error(err)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  const raffleAttendee = () => {
    sendHttpRequest('POST', `/api/raffle?phone_number=${encodeURIComponent(scannedData)}`, true)
      .then(res => {
        if (res.error) {
          console.error(res.error)
        } else {
          // setResult(res.data)
          console.log(res.data)
        }
      })
      .catch(err => {
        console.error(err)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  // Start the video stream and scan for barcodes when the component mounts
  // useEffect(() => openResult(), [])
  React.useEffect(() => {
    getUserMedia()
  },);

  return (
    <div className={style.appContainer}>
      {!resultOpened && <div className={style.scanPage}>
        <div className={style.cameraContainer}>
          <video
            ref={videoRef}
            id="video"
            autoPlay
            playsInline
          />
        </div>
      </div>}

      {resultOpened && <div className={style.resultPage}>
        <Typography sx={{p: 2}} variant="h5">Scanned data: {scannedData}</Typography>

        <Card sx={{ p: 2, minWidth: 275 }}>
          <Typography>Name: {result?.first_name} {result?.last_name}</Typography>
          <Typography>Phone Number: {result?.phone_number}</Typography>
          <Typography>Token: {result?.token}</Typography>
        </Card>

        <Button
          variant="contained"
          onClick={() => {
            setResultOpened(false)
          }}>
            done
          </Button>

        <Button
          variant="contained"
          onClick={() => {
            attendRegistrant()
          }}>
            attend
          </Button>

        <Button
          variant="contained"
          onClick={() => {
            raffleAttendee()
          }}>
            raffle
          </Button>
      </div>}

    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);