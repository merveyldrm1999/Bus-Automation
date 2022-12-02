import { Autocomplete, Container } from "@mui/material";
import { Button, Grid, TextField, Modal, Box } from "@mui/material";
import format from "date-fns/format";
import getDay from "date-fns/getDay";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import { useEffect, useState } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useForm } from "react-hook-form";
import Bus from "../comp/bus";
import axios from "../config/axios";

const locales = {
  "en-US": require("date-fns/locale/en-US"),
};
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});
export default function Home() {
  const [voyage, setVoyage] = useState([
    {
      bus_id: 1,
      fee: 5,
      start: "2022-11-29T20:48:31.410Z",
      nereden: 1,
      nereye: 2,
    },
  ]);
  const [busType, setBusType] = useState(1);
  const [numberOfSeats, setNumberOfSeats] = useState(20);
  const handleSelectedEvent = () => {
    setOpen(true);
  };
  const [open, setOpen] = useState(false);

  const [sef, setSef] = useState([]);

  const [allCity, setAllCity] = useState([]);

  const [neredenn, setNeredenn] = useState([]);
  const [nereyee, setNereyee] = useState([]);

  useEffect(() => {
    axios.get("buy-ticket").then((res) => {
      console.log(res.data.province);
      let sefer = res.data.bus.filter((element) => {
        let findBus = res.data.voyage.find((vo) => {
          if (element.id == vo.bus.id) {
            return vo;
          }
        });
        if (findBus == undefined) {
          return element;
        }
      });
      console.log(sefer);

      setSef(sefer);
      setAllCity(res.data.province);
      setNeredenn(res.data.province);
      setNereyee(res.data.province);

      res.data.voyage.map((voy) => {
        let addvoyage = {
          title: voy.bus.plate_number,
          start: voy.date,
          end: voy.date,
          resource: {
            nereden: voy.from,
            nereye: voy.to,
            fee: voy.fee,
            bus: voy.bus,
            id: voy.id,
          },
        };
        setCalenderVoyage((calenderVoyage) => [...calenderVoyage, addvoyage]);
      });
    });
  }, []);

  const [calenderVoyage, setCalenderVoyage] = useState([]);
  //   useEffect(() => {
  //     voyage.map((v) => {
  //       let neredenTitle = allCity.find((a) => a.value == v.nereden);
  //       let nereyeTitle = allCity.find((b) => b.value == v.nereye);
  //       let addvoyage = {
  //         title: neredenTitle.name + " - " + nereyeTitle.name,
  //         start: v.start,
  //         end: v.start,
  //         resource: {
  //           nereden: neredenTitle,
  //           nereye: nereyeTitle,
  //           fee: v.fee,
  //           bus: v.bus,
  //         },
  //       };

  //       setCalenderVoyage((calenderVoyage) => [...calenderVoyage, addvoyage]);
  //       console.log(calenderVoyage);
  //     });
  //   }, [voyage]);

  const filter = () => {};

  const [nereden, setNereden] = useState();
  const [nereye, setNereye] = useState();

  return (
    <Container>
      <Grid>
        <Autocomplete
          options={neredenn}
          getOptionLabel={(neredenn) => neredenn.name}
          onChange={(event, newValue) => {
            const data = allCity.filter((n) => n.id != newValue.id);

            setNereyee(data);
          }}
          value={nereden}
          fullWidth
          renderInput={(params) => (
            <TextField fullWidth {...params} label="Nereden" />
          )}
        />
      </Grid>
      <Grid>
        <Autocomplete
          options={nereyee}
          getOptionLabel={(nereyee) => nereyee.name}
          onChange={(event, newValue) => {
            const data = allCity.filter((n) => n.id != newValue.id);
            setNeredenn(data);
          }}
          value={nereye}
          fullWidth
          renderInput={(params) => (
            <TextField fullWidth {...params} label="Nereye" />
          )}
        />
      </Grid>
      <Grid>
        <Button onClick={filter()}>Filtrele</Button>
      </Grid>
      <Grid>
        <Calendar
          localizer={localizer}
          events={calenderVoyage}
          startAccessor="start"
          onSelectEvent={(event) => handleSelectedEvent(event)}
          popup
          endAccessor="end"
          style={{ height: 500, margin: "50px" }}
        />
      </Grid>
      {open && <Bus numberOfSeats={numberOfSeats} busType={busType} />}
    </Container>
  );
}
