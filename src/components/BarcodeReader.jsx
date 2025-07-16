import { useRef, useState } from "react";
import {
  BrowserMultiFormatReader,
  listVideoInputDevices,
} from "@zxing/browser";

function BarcodeReader() {
  const videoRef = useRef(null);
  const codeReaderRef = useRef(null);
  const [resultado, setResultado] = useState("Nenhum código lido ainda.");
  const [isReading, setIsReading] = useState(false);

  const iniciarLeitura = async () => {
    if (isReading) return;

    setResultado("Iniciando leitura...");
    setIsReading(true);
    const codeReader = new BrowserMultiFormatReader();
    codeReaderRef.current = codeReader;

    try {
      const videoInputDevices = await listVideoInputDevices();

      if (videoInputDevices.length === 0) {
        setResultado("Nenhuma câmera encontrada.");
        setIsReading(false);
        return;
      }

      const selectedDeviceId = videoInputDevices[0].deviceId;

      codeReader.decodeFromVideoDevice(
        selectedDeviceId,
        videoRef.current,
        (result, err, controls) => {
          if (result) {
            setResultado(`Código lido: ${result.getText()}`);
            controls.stop(); // Para automaticamente
            setIsReading(false);
          }

          if (err && !(err.name === "NotFoundException")) {
            console.error("Erro de leitura:", err);
          }
        }
      );
    } catch (error) {
      console.error("Erro ao iniciar leitura:", error);
      setResultado("Erro ao acessar a câmera.");
      setIsReading(false);
    }
  };

  const pararLeitura = () => {
    if (codeReaderRef.current) {
      codeReaderRef.current.reset();
      setIsReading(false);
      setResultado("Leitura parada manualmente.");
    }
  };

  return (
    <div>
      <h2>Leitor de Código de Barras</h2>
      <video ref={videoRef} style={{ width: "100%", maxWidth: 400 }} />
      <div style={{ marginTop: "10px" }}>
        <button onClick={iniciarLeitura} disabled={isReading}>
          Iniciar Leitura
        </button>
        <button
          onClick={pararLeitura}
          disabled={!isReading}
          style={{ marginLeft: "10px" }}
        >
          Parar Leitura
        </button>
      </div>
      <p>
        <strong>Resultado:</strong> {resultado}
      </p>
    </div>
  );
}

export default BarcodeReader;
