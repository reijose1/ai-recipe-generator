import { useState } from "react";
//import { Loader, Placeholder, Button } from "@aws-amplify/ui-react";
//import { Amplify } from "aws-amplify";
//import { Schema } from "../amplify/data/resource";
//import { generateClient } from "aws-amplify/data";
//import outputs from "../amplify_outputs.json";

import "@aws-amplify/ui-react/styles.css";

// Nuevo estado para textToTranslate

const Translate = () => {
  const [textToTranslate] = useState<string | null>(null);

  const handleTranslate = () => {
    if (!textToTranslate) {
      return (
        <p>It is necessary to generate a text first to perform this task.</p>
      ); // Mensaje condicional
    }
    // Aquí se coloca la lógica de traducción con Amazon Translate

    return <p>{textToTranslate}</p>;
  };

  return (
    <div>
      <button type="submit" className="reader-button" onClick={handleTranslate}>
        Translate
      </button>
    </div>
  );
};

export default Translate;
