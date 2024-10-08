import { useState } from "react";
import { TranslateClient, TranslateTextCommand } from "@aws-sdk/client-translate";

const translateClient = new TranslateClient({
  region: "us-east-1",
  credentials: {
    accessKeyId: process.env.VITE_AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.VITE_AWS_SECRET_ACCESS_KEY || '',
  },
});

const TranslateComponent = () => {
  const [text, setText] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const translateText = async () => {
    if (!text.trim()) {
      alert("Please enter some text to translate");
      return;
    }
  
    if (text.length > 5000) {
      alert("Text exceeds the 5000 character limit");
      return;
    }
    
    setLoading(true);
    setErrorMessage(""); // Reinicia el mensaje de error

    try {
      console.log("Access Key:", process.env.VITE_AWS_ACCESS_KEY_ID); // Verifica la clave de acceso
      const params = {
        Text: text,
        SourceLanguageCode: "en",
        TargetLanguageCode: "es",
      };

      console.log("Sending translation request with params:", params);

      const command = new TranslateTextCommand(params);
      const response = await translateClient.send(command);

      console.log("Response from Translate API:", response);

      // Verifica si la respuesta es válida y establece el texto traducido
      if (response && response.TranslatedText) {
        console.log("Translated Text:", response.TranslatedText); // Log para verificar el texto traducido
        setTranslatedText(response.TranslatedText || "");
      } else {
        setErrorMessage("Translation failed, but no error message provided.");
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error("Translation error:", error.message);
        setErrorMessage(`Translation error: ${error.message}`);
      } else {
        console.error("An unknown error occurred:", error);
        setErrorMessage("An unknown error occurred during translation.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Translate Area</h1>
      <textarea
        placeholder="Enter text to translate"
        className="reader-textarea"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button
        onClick={translateText}
        disabled={loading}
        className="translate-button"
      >
        {loading ? "Translating..." : "Translate"}
      </button>
      {translatedText && <p className="translated-respuesta"> {translatedText}</p>}
      {errorMessage && <p className="error-message">{errorMessage}</p>} {/* Muestra errores */}
    </div>
  );
};

export default TranslateComponent;
