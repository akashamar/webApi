import React, { useState, useEffect, useRef } from "react";
import "./App.css";

function App() {
  const [imgData, setImgData] = useState("");
  const [imageCapture, setImageCapture] = useState(null);
  const videoRef = useRef(null);

  useEffect(() => {
    const getMediaDevice = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
          videoRef.current.play();
        }
        const track = mediaStream.getVideoTracks()[0];
        const capabilities = track.getCapabilities();
        const settings = track.getSettings();
        console.log(capabilities, settings);
        setImageCapture(new ImageCapture(track));
      } catch (err) {
        console.log(err);
      }
    };

    getMediaDevice();
  }, []);

  const onTakePhotoButtonClick = async () => {
    try {
      const blob = await imageCapture.takePhoto();
      const imageBitmap = await createImageBitmap(blob);
      console.log(`Photo size is ${imageBitmap.width}x${imageBitmap.height}`);
      setImgData(URL.createObjectURL(blob));
      console.log(blob);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="App">
      <video ref={videoRef} id="video-track" />
      <div className="right-elements">
        <img src={imgData} alt="img" className="screenshot" />
        <button onClick={onTakePhotoButtonClick}>Take screen shot</button>
      </div>
    </div>
  );
}

export default App;
