import { useEffect, useRef, useState } from "react";

function BarcodeReader() {
  const videoRef = useRef(null);
  const [codeReader, setCodeReader] = useState(null);
  const [scanning, setScanning] = useState(false);
  const [codigo, setCodigo] = useState("Código lido: nenhum");

  useEffect(() => {
    // A biblioteca deve estar disponível via CDN (window.ZXing)
    if (window.ZXing) {
      setCodeReader(new window.ZXing.BrowserMultiFormatReader());
    }
  }, []);

  const iniciarLeitura = async () => {
    const video = videoRef.current;

    if (!codeReader) return;

    video.style.display = "block";

    try {
      const devices = await codeReader.listVideoInputDevices();

      const backCamera = devices.find((device) =>
        /back|trás|environment/i.test(device.label)
      );

      const selectedDeviceId = backCamera
        ? backCamera.deviceId
        : devices[0]?.deviceId;

      setScanning(true);

      codeReader.decodeFromVideoDevice(
        selectedDeviceId,
        video,
        (result, err) => {
          if (result && scanning) {
            setCodigo("Código lido: " + result.getText());

            codeReader.reset();
            setScanning(false);
            video.style.display = "none";
          }

          if (err && err.name !== "NotFoundException") {
            console.error("Erro ao ler código:", err);
          }
        }
      );
    } catch (error) {
      console.error("Erro ao acessar câmera: ", error);
    }
  };

  const pararLeitura = () => {
    if (codeReader) {
      codeReader.reset();
      setScanning(false);
      if (videoRef.current) {
        videoRef.current.style.display = "none";
      }
    }
  };

  return (
    <div style={{ textAlign: "center" }}>
      <h2>Escaneie um Código de Barras</h2>

      <button onClick={iniciarLeitura} disabled={scanning}>
        📷 Iniciar Leitura
      </button>
      <button onClick={pararLeitura} disabled={!scanning}>
        🛑 Parar Leitura
      </button>

      <br />
      <br />

      <video
        ref={videoRef}
        width="320"
        height="100"
        style={{
          border: "1px solid black",
          display: "none",
          transform: "rotate(90deg)",
        }}
        muted
        playsInline
      />

      <p>{codigo}</p>
    </div>
  );
}

export default BarcodeReader;
