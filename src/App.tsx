import { FormEvent, useState } from "react";
import { Loader, Placeholder, Button } from "@aws-amplify/ui-react";
import "./App.css";
import { Amplify } from "aws-amplify";
import { Schema } from "../amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import outputs from "../amplify_outputs.json";

import "@aws-amplify/ui-react/styles.css";
import Speech from "./Speech";
import Translate from "./Translate";

Amplify.configure(outputs);

const amplifyClient = generateClient<Schema>({
  authMode: "userPool",
});

interface AppProps {
  signOut?: () => void;
  user?: {
    username: string;
    attributes: {
      email: string;
    };
  };
}

function App({ signOut, user }: AppProps) {
  // Cambiar la declaración de textToTranslate para ser parte del estado
  const [result, setResult] = useState<string>("");
  const [loading, setLoading] = useState(false);

  // Función que maneja el envío del formulario
  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData(event.currentTarget);

      const { data, errors } = await amplifyClient.queries.askBedrock({
        ingredients: [formData.get("ingredients")?.toString() || ""],
      });

      if (!errors) {
        const generatedResult = data?.body || "No data returned";
        setResult(generatedResult);
      } else {
        console.log(errors);
      }
    } catch (e) {
      alert(`An error occurred: ${e}`);
    } finally {
      setLoading(false);
    }
  };

  // Nueva función para gestionar la traducción


  return (
    <div className="">
      <div className=" p-4">
        {user && <div className="mb-4"></div>}
        {signOut && (
          <Button
            onClick={signOut}
            className="logout-button bg-red-500 text-white px-4 py-2 rounded"
          >
            See You soon, Amiguito!
          </Button>
        )}
      </div>
      <br />
      <br />
      <div className="app-container">
        <div className="background-image header-container">
          <h1 className=" main-header">
            Meet Your Personal
            <br />
            <span className="highlight">Amazing Stories Teller</span>
          </h1>
          <br />
          <p className="description">
            Simply type a few words using the format word1, word2, etc., and our
            AI-powered storyteller will generate an all-new tale for you on
            demand...
          </p>
        </div>
        <form onSubmit={onSubmit} className="form-container">
          <div className="search-container">
            <input
              type="text"
              className="wide-input"
              id="ingredients"
              name="ingredients"
              placeholder="Word1, Word2, Word3,...etc"
            />
            <button type="submit" className="search-button">
              Generate
            </button>
          </div>
        </form>
        <div className="result-container">
          {loading ? (
            <div className="loader-container">
              <p>Loading...</p>
              <Loader size="large" />
              <Placeholder size="large" />
              <Placeholder size="large" />
              <Placeholder size="large" />
            </div>
          ) : (
            result && <p className="result">{result}</p>
          )}

          <br />
          <Translate />
          <Speech />
        </div>
      </div>
    </div>
  );
}

export default App;

