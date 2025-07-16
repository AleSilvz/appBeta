import { BrowserMultiFormatReader } from "@zxing/library";
import { useRef, useState } from "react";

function BarcodeReader() {
  const videoRef = useRef(null);
  const [scanning, setScanning] = useState(false);
  const [codigo, setCodigo] = useState("");
  const [codeReader] = useState(() => new BrowserMultiFormatReader());

  const iniciarLeitura = async () => {
    const video = videoRef.current;
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
        'video',
        (result, err) => {
          if (result && scanning) {
            setCodigo(result.getText());
            pararLeitura();
          }

          if (err && err.name !== "NotFoundException") {
            console.error("Erro ao ler código:", err);
          }
        }
      );
    } catch (error) {
      console.error("Erro ao acessar câmera:", error);
    }
  };

  const pararLeitura = () => {
    codeReader.reset();
    setScanning(false);
    if (videoRef.current) {
      videoRef.current.style.display = "none";
    }
  };

  return (
    <div style={{ textAlign: "center" }}>
      <h2>Leitor de Código de Barras</h2>

      <video
        ref={videoRef}
        style={{
          width: "100%",
          maxWidth: "400px",
          display: "none",
          border: "1px solid black",
        }}
        muted
        playsInline
      />

      <div style={{ margin: "10px" }}>
        <button onClick={iniciarLeitura} disabled={scanning}>
          Iniciar
        </button>
        <button onClick={pararLeitura} disabled={!scanning}>
          Parar
        </button>
      </div>

      <p id="codigo">{codigo || "Nenhum código lido ainda"}</p>
    </div>
  );
}

export default BarcodeReader;
