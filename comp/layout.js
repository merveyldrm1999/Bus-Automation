import { AppBar, Box, Button, IconButton, Toolbar } from "@mui/material";
import { useRouter } from "next/router";
import React from "react";

const Layout = ({ children }) => {
  const router = useRouter();

  const onLogout = () => {
    localStorage.removeItem("jwt");
    router.push("/login");
  };

  return (
    <>
      {router.pathname !== "/login" && (
        <Box>
          <AppBar position="sticky" component="nav">
            <Toolbar>
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                sx={{ mr: 2, display: { sm: "none" } }}
              ></IconButton>

              <Button href="/defination" sx={{ color: "#fff" }}>
                Otobüs Tanımlama
              </Button>
              <Button href="/expedition" sx={{ color: "#fff" }}>
                Sefer Tanımlama
              </Button>
              <Button href="/ticketBuy" sx={{ color: "#fff" }}>
                Bilet Al
              </Button>
              <Button sx={{ color: "#fff" }} onClick={onLogout}>
                Çıkış Yap
              </Button>
            </Toolbar>
          </AppBar>
        </Box>
      )}
      {children}
    </>
  );
};

export default Layout;
