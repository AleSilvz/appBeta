import { useRef, useState, useEffect } from "react";
import { BrowserMultiFormatReader } from "@zxing/browser";

function BarcodeReader() {
  const videoRef = useRef(null);
  const codeReaderRef = useRef(null);
  const [codigo, setCodigo] = useState("Nenhum código lido ainda");
  const [scanning, setScanning] = useState(false);

  const iniciarLeitura = async () => {
    if (!videoRef.current) return;

    const devices = await BrowserMultiFormatReader.listVideoInputDevices();

    const backCamera = devices.find((device) =>
      /back|trás|environment/i.test(device.label)
    );

    const selectedDeviceId = backCamera?.deviceId || devices[0]?.deviceId;

    codeReaderRef.current = new BrowserMultiFormatReader();

    setScanning(true);

    codeReaderRef.current.decodeFromVideoDevice(
      selectedDeviceId,
      videoRef.current,
      (result, err) => {
        if (result) {
          setCodigo("Código lido: " + result.getText());
          setScanning(false);
          pararLeitura();
        }

        if (err && err.name !== "NotFoundException") {
          console.error("Erro ao ler código:", err);
        }
      }
    );
  };

  const pararLeitura = () => {
    if (codeReaderRef.current) {
      codeReaderRef.current.reset();
      codeReaderRef.current = null;
    }
  };

  useEffect(() => {
    return () => pararLeitura();
  }, []);

  return (
    <div style={{ textAlign: "center" }}>
      <h2>Leitor de Código (QR / Barras)</h2>

      <video
        ref={videoRef}
        style={{
          width: "100%",
          maxWidth: "400px",
          border: "1px solid black",
          marginBottom: "10px",
        }}
        muted
        autoPlay
        playsInline
      />

      <p>{codigo}</p>

      <div>
        <button onClick={iniciarLeitura} disabled={scanning}>
          📷 Iniciar Leitura
        </button>
        <button onClick={pararLeitura} disabled={!scanning}>
          🛑 Parar
        </button>
      </div>
    </div>
  );
}

export default BarcodeReader;
