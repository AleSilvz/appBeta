import { BrowserMultiFormatReader } from "@zxing/library";
import { useRef, useState } from "react";

function BarcodeReader() {
  const videoRef = useRef(null);
  const codeReader = useRef(null);
  const [result, setResult] = useState("");
  const [isScanning, setIsScanning] = useState(false);

  const iniciar = async () => {
    codeReader.current = new BrowserMultiFormatReader();
    setResult("");
    setIsScanning(true);

    try {
      const devices = await codeReader.current.listVideoInputDevices();
      const id = devices[0]?.deviceId;

      if (!id) {
        alert("Nenhuma câmera encontrada.");
        return;
      }

      codeReader.current.decodeFromVideoDevice(
        id,
        videoRef.current,
        (result, err) => {
          if (result) {
            setResult(result.getText());
          }

          if (err && err.name !== "NotFoundException") {
            console.error("Erro na leitura:", err);
          }
        }
      );
    } catch (error) {}
  };

  return (
    <div>
      <h2>Leitor de Código de Barras</h2>
      <video ref={videoRef} style={{ width: "100%", maxWidth: 400 }} />

      <button onClick={iniciar}>Iniciar Leitura</button>

      <p>
        <strong>Resultado:</strong>
      </p>
    </div>
  );
}

export default BarcodeReader;
