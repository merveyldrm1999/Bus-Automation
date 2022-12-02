import Layout from "../comp/layout";
import "../styles/globals.css";
// import { AuthProvider } from "../context/AuthContext";
import { MainContext, useContext } from "../context";
import { useState } from "react";

function MyApp({ Component, pageProps }) {
  const [jwt, setJwt] = useState("");
  const data = {
    jwt,
    setJwt,
  };

  return (
    <MainContext.Provider value={data}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </MainContext.Provider>
  );
}

export default MyApp;
