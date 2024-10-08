import React, { useState } from "react";
import { PollyClient, SynthesizeSpeechCommand } from "@aws-sdk/client-polly";
import { fromCognitoIdentityPool } from "@aws-sdk/credential-providers";

const Speech = () => {
  const [text, setText] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  };

  const handleSpeech = async () => {
    if (!text) {
      alert("Please enter some text to synthesize.");
      return; // No hacer nada si el campo está vacío
    }

    setIsLoading(true);
    try {
      const client = new PollyClient({
        //region: process.env.REACT_APP_AWS_REGION,
        region: "us-east-1",
        credentials: fromCognitoIdentityPool({
          clientConfig: { region: "us-east-1" },
          //clientConfig: { region: process.env.REACT_APP_AWS_REGION },
          identityPoolId: "us-east-1:e1ab352d-58ff-4c28-b0a9-d73fc0a3a625"!,
          //identityPoolId: process.env.REACT_APP_IDENTITY_POOL_ID!
        }),
      });

      const command = new SynthesizeSpeechCommand({
        Text: text,
        OutputFormat: "mp3",
        VoiceId: "Salli",
      });

      const { AudioStream } = await client.send(command);
      if (AudioStream instanceof ReadableStream) {
        const reader = AudioStream.getReader();
        const chunks: Uint8Array[] = [];
        let done = false;

        // Leer los datos de AudioStream
        while (!done) {
          const { value, done: isDone } = await reader.read();
          done = isDone;
          if (value) {
            chunks.push(value);
          }
        }

        // Crear un Blob a partir de los chunks
        const blob = new Blob(chunks, { type: "audio/mpeg" });
        const url = URL.createObjectURL(blob);
        const audio = new Audio(url);
        audio.play();
      }
    } catch (error) {
      console.error("Error synthesizing speech:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="reader-container">
      <h1>Speech Area</h1>
      <textarea
        placeholder="Enter the text or fragment you want to hear"
        className="reader-textarea"
        value={text} // Asigna el valor del estado al textarea
        onChange={handleTextChange} // Maneja el cambio de texto
      />
      <button
        type="button" // Cambia a "button" para evitar enviar el formulario
        className="reader-button"
        onClick={handleSpeech} // Llama a la función handleSpeech al hacer clic
        disabled={isLoading} // Desactiva el botón mientras se está cargando
      >
        {isLoading ? "Loading..." : "Speech"}
      </button>
    </div>
  );
};

export default Speech;
