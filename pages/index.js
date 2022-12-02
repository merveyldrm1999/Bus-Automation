import { Container } from "@mui/material";
import { Router, useRouter } from "next/router";
import { useEffect } from "react";
import { MainContext, useContext } from "../context";

export default function Home() {
  const { jwt } = useContext(MainContext);
  const router = useRouter();

  useEffect(() => {
    console.log(localStorage.getItem("jwt"));
    if (localStorage.getItem("jwt") === null) {
      router.push("/login");
    }
  }, []);

  return <Container maxWidth="sm"></Container>;
}
