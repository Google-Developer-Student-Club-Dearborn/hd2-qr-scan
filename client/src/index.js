import React, { useRef, useState } from 'react';
import ReactDOM from 'react-dom/client';
import { sendHttpRequest } from './utils';
import Button from '@mui/material/Button';

// To use Html5Qrcode (more info below)

import "./global.css"
import style from "./style.module.css"
import { Card, CircularProgress, Typography } from '@mui/material';
import Html5QrcodePlugin from './Html5QrcodePlugin';

import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

const App = () => {

  const [scannedData, setScannedData] = useState(null);
  const [result, setResult] = useState(null)
  const [resultOpened, setResultOpened] = useState(false)
  const [loading, setLoading] = useState(false)

  const openResult = (text) => {
    setResultOpened(true)
    setLoading(true)
    setResult(null)
    sendHttpRequest('GET', `/api/registrant?phone_number=${encodeURIComponent(text)}`, true)
      .then(res => {
        if (res.error) {
          setResultOpened(false)
          setResult(null)
          setScannedData(null)
          alert(`Error getting data: ${text}`)
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
    setLoading(true)
    sendHttpRequest('POST', `/api/attend?phone_number=${encodeURIComponent(scannedData)}`, true)
      .then(res => {
        if (res.error) {
          alert("Error attending registrant")
          console.error(res.error)
        } else {
          // setResult(res.data)
          alert("Registrant attended successfully")
          console.log(res.data)
        }
      })
      .catch(err => {
        console.error(err)
      })
      .finally(() => {
        setLoading(false)
        setResultOpened(false)
      })
  }

  const raffleAttendee = () => {
    setLoading(true)
    sendHttpRequest('POST', `/api/raffle?phone_number=${encodeURIComponent(scannedData)}`, true)
      .then(res => {
        if (res.error) {
          console.error(res.error)
        } else {
          // setResult(res.data)
          alert("Attended raffled successfully")
          console.log(res.data)
        }
      })
      .catch(err => {
        console.error(err)
      })
      .finally(() => {
        setLoading(false)
        setResultOpened(false)
      })
  }

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <div className={style.appContainer}>

        {
          !resultOpened && <div className={style.scanPage}>
            <div className={style.cameraContainer}>
              <Html5QrcodePlugin
                fps={10}
                disableFlip={false}
                qrCodeSuccessCallback={(decodedText, decodedResult) => {
                  console.log(`Code matched = ${decodedText}`, decodedResult);
                  setScannedData(decodedText)
                  openResult(decodedText)
                }}
              />
            </div>

            <button style={{ position: "absolute", bottom: 30, right: 30 }} onClick={() => { setScannedData("+12488707620"); openResult("+12488707620") }}>mock scan +12488707620</button>
          </div>
        }

        {
          resultOpened && <div className={style.resultPage}>
            <Typography sx={{ p: 2 }} variant="h5">Scanned data: {scannedData}</Typography>
            {
              loading
                ?
                <CircularProgress />
                : <React.Fragment>
                  <Card sx={{ p: 2, minWidth: 275 }}>
                    <Typography>Name: {result?.first_name} {result?.last_name}</Typography>
                    <Typography>Phone Number: {result?.phone_number}</Typography>
                    <Typography>Token: {result?.token}</Typography>
                    <Typography>Attended: {result?.attended ? "Yes" : "No"}</Typography>
                  </Card>

                  <Button
                    variant="contained"
                    onClick={() => {
                      setResultOpened(false)
                    }}>
                    done
                  </Button>

                  {<Button
                    disabled={result.attended}
                    variant="contained"
                    onClick={() => {
                      attendRegistrant()
                    }}>
                    {result.attended ? "attended" : "attend"}
                  </Button>}

                  <Button
                    variant="contained"
                    onClick={() => {
                      raffleAttendee()
                    }}>
                    raffle
                  </Button>
                </React.Fragment>
            }

          </div>
        }

      </div>
    </ThemeProvider>

  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);