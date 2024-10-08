import { useState } from "react";
import { TranslateClient, TranslateTextCommand } from "@aws-sdk/client-translate";
import { fromCognitoIdentityPool } from "@aws-sdk/credential-providers";

// Inicializa el cliente de traducción
const translateClient = new TranslateClient({
  region: "us-east-1",
  credentials: fromCognitoIdentityPool({
    clientConfig: { region: "us-east-1" },
    identityPoolId: "us-east-1:4120a930-72b9-44d5-85f9-1c055e26ff8e", // Cambia esto a una variable de entorno si es necesario
  }),
});

const TranslateComponent = () => {
  const [text, setText] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const translateText = async () => {
    // Validar texto ingresado
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
        setTranslatedText(response.TranslatedText);
      } else {
        setErrorMessage("Translation failed, but no error message provided.");
      }
    } catch (error) {
      // Manejo de errores
      const errorMsg = error instanceof Error ? error.message : "An unknown error occurred during translation.";
      console.error("Translation error:", errorMsg);
      setErrorMessage(`Translation error: ${errorMsg}`);
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
      {translatedText && <p className="translated-response">{translatedText}</p>}
      {errorMessage && <p className="error-message">{errorMessage}</p>} {/* Muestra errores */}
    </div>
  );
};

export default TranslateComponent;

