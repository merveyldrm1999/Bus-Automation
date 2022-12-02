import { Autocomplete, Container } from "@mui/material";
import { useRouter } from "next/router";
import { Button, Grid, TextField, Modal, Box } from "@mui/material";
import * as yup from "yup";
import { useForm, Controller, set } from "react-hook-form";
import { useEffect, useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { MainContext, useContext } from "../context";
import format from "date-fns/format";
import getDay from "date-fns/getDay";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import axios from "../config/axios";
import moment from "moment";

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

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};
const expeditionSchema = yup.object().shape({});
export default function Home() {
  useEffect(() => {
    console.log(localStorage.getItem("jwt"));
    if (localStorage.getItem("jwt") === null) {
      router.push("/login");
    }
  }, []);
  const { jwt } = useContext(MainContext);

  const router = useRouter();
  const {
    handleSubmit,
    control,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(expeditionSchema),
  });

  const [buses, setBuses] = useState([]);
  const [allCity, setAllCity] = useState([]);

  const [neredenn, setNeredenn] = useState([]);
  const [nereyee, setNereyee] = useState([]);

  useEffect(() => {
    axios.get("voyage").then((res) => {
      let seferdeYok = res.data.bus.filter((element) => {
        let findBus = res.data.voyage.find((vo) => {
          if (element.id == vo.bus.id) {
            return vo;
          }
        });
        if (findBus == undefined) {
          return element;
        }
      });
      console.log(seferdeYok);

      setBuses(seferdeYok);
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

  const [voyage, setVoyage] = useState([]);

  const [calenderVoyage, setCalenderVoyage] = useState([]);
  const [expeditionDate, setExpeditionDate] = useState(new Date());

  const onSave = (data) => {
    console.log(data);
    const voyagee = {
      fee: parseInt(data.fee),
      from: data.nereden.id,
      to: data.nereye.id,
      date: expeditionDate,
      bus: data.bus,
    };
    axios.post("voyage", voyagee).then((res) => {
      const addvoyage = {
        title: data.nereden.name + " - " + data.nereye.name,
        start: expeditionDate,
        end: expeditionDate,
        resource: {
          nereden: data.nereden,
          nereye: data.nereye,
          fee: data.fee,
          bus: data.bus,
        },
      };
      setCalenderVoyage((calenderVoyage) => [...calenderVoyage, addvoyage]);
    });
  };

  const [modalBus, setModalBus] = useState({});
  const [modalFee, setModalFee] = useState(0);
  const [modalDate, setModalDate] = useState("");
  const [modalTitle, setModalTitle] = useState({});
  const handleSelectedEvent = (event) => {
    console.log(event);
    setModalTitle(event.title);
    setModalBus(event.resource.bus);
    setModalDate(event.start.toString());
    setModalFee(event.resource.fee);
    setVoyageId(event.resource.id);
    handleOpen();
  };

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handsubmidTime = (value) => {
    setExpeditionDate(value);
  };
  const [voyageId, setVoyageId] = useState(0);

  const expeditionDelete = () => {
    axios.delete("voyage/" + voyageId).then((res) => {
      const voy = voyage.filter((v) => v.id != voyageId);
      setVoyage(voy);

      const calVoy = calenderVoyage.filter((c) => c.resource.id != voyageId);
      setCalenderVoyage(calVoy);

      console.log(calenderVoyage);
    });
  };

  return (
    <Container>
      <form onSubmit={handleSubmit((data) => onSave(data))}>
        <Grid container direction="column">
          <Grid item pt={2}>
            <Controller
              control={control}
              name="bus"
              fullWidth
              render={({ field: { onChange, bus, ref } }) => (
                <Autocomplete
                  options={buses}
                  getOptionLabel={(buses) => buses.plate_number}
                  onChange={(event, newValue) => {
                    onChange(newValue);
                  }}
                  value={bus}
                  fullWidth
                  renderInput={(params) => (
                    <TextField fullWidth {...params} label="Otobüs Seç" />
                  )}
                />
              )}
            />
            {errors.bus && <p>{errors.bus.message}</p>}
          </Grid>
          <Grid item={3} pt={2}>
            <Controller
              control={control}
              name="fee"
              fullWidth
              render={({ field: { onChange, fee, ref } }) => (
                <TextField
                  onChange={onChange}
                  value={fee}
                  type="number"
                  fullWidth
                  label="Koltuk ücreti"
                />
              )}
            />
            {errors.model && <p>{errors.model.message}</p>}
          </Grid>
          <Grid item pt={2}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateTimePicker
                value={expeditionDate}
                label="Gün Ve Saati"
                onChange={handsubmidTime}
                renderInput={(params) => <TextField {...params} />}
              />
            </LocalizationProvider>
          </Grid>

          <Grid item pt={2}>
            <Controller
              control={control}
              name="nereden"
              fullWidth
              render={({ field: { onChange, nereden, ref } }) => (
                <Autocomplete
                  options={neredenn}
                  getOptionLabel={(neredenn) => neredenn.name}
                  onChange={(event, newValue) => {
                    onChange(newValue);
                    const data = allCity.filter((n) => n.id != newValue.id);
                    setNereyee(data);
                  }}
                  value={nereden}
                  fullWidth
                  renderInput={(params) => (
                    <TextField fullWidth {...params} label="Nereden" />
                  )}
                />
              )}
            />
            {errors.bus && <p>{errors.bus.message}</p>}
          </Grid>
          <Grid item pt={2}>
            <Controller
              control={control}
              name="nereye"
              fullWidth
              render={({ field: { onChange, nereye, ref } }) => (
                <Autocomplete
                  options={nereyee}
                  getOptionLabel={(nereyee) => nereyee.name}
                  onChange={(event, newValue) => {
                    const ne = allCity.filter((a) => a.id != newValue.id);

                    setNeredenn(ne);

                    onChange(newValue);
                  }}
                  value={nereye}
                  fullWidth
                  renderInput={(params) => (
                    <TextField fullWidth {...params} label="Nereye" />
                  )}
                />
              )}
            />
            {errors.bus && <p>{errors.bus.message}</p>}
          </Grid>
          <Grid item pt={2}>
            <Button type="submit" variant="contained" color="success">
              Kaydet
            </Button>
          </Grid>
        </Grid>
      </form>
      <Grid xs={12}>
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
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Grid Container>
            <h2>{modalTitle}</h2>
            <Grid container>
              <strong> Plaka:</strong> <label>{modalBus.plate_number}</label>
            </Grid>
            <Grid container>
              <strong> Koltuk Ücreti:</strong> <label>{modalFee}</label>
            </Grid>
            <Grid container>
              <strong> Gün:</strong> <label>{modalDate}</label>
            </Grid>
          </Grid>
          <Grid>
            <Button onClick={() => expeditionDelete()}>Seferi Sil</Button>
          </Grid>
        </Box>
      </Modal>
    </Container>
  );
}
