import { AirlineSeatReclineExtra } from "@mui/icons-material";
import { AppBar, Box, Button, Grid, IconButton, Toolbar } from "@mui/material";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

const Bus = ({ numberOfSeats, busType }) => {
  const [seats, setSeats] = useState([]);
  let koltukNo = 0;
  useEffect(() => {
    setSeats([]);
    for (let i = 0; i < numberOfSeats - 1; i++) {
      setSeats((seats) => [...seats, ...[1]]);
    }
  }, [numberOfSeats]);

  return (
    <>
      <Box
        sx={{
          width: 300,
          backgroundColor: "primary.dark",
          "&:hover": {
            backgroundColor: "primary.main",
            opacity: [0.9, 0.8, 0.7],
          },
        }}
      >
        <Grid container>
          <Grid item sm={12} p={3}>
            <AirlineSeatReclineExtra fontSize="large" />
          </Grid>

          {seats.map((v, i) => {
            return (
              <Grid item sm={busType.value == 1 && i % 3 == 0 ? 6 : 3} p={3}>
                <AirlineSeatReclineExtra fontSize="large" /> {i + 1}
              </Grid>
            );
          })}
        </Grid>
      </Box>
    </>
  );
};

export default Bus;
