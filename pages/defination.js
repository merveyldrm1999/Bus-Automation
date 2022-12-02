import { Autocomplete, Container } from "@mui/material";
import { Router, useRouter } from "next/router";
import { Button, Grid, TextField } from "@mui/material";
import * as yup from "yup";
import { useForm, Controller, set } from "react-hook-form";
import { useEffect, useMemo, useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import axios from "../config/axios";
import { MainContext, useContext } from "../context";
import Bus from "../comp/bus";

const definationSchema = yup.object().shape({
  plaka: yup
    .string()
    .trim()
    .matches(
      /^(0[1-9]|[1-7][0-9]|8[01])((\s?[a-zA-Z]\s?)(\d{4,5})|(\s?[a-zA-Z]{2}\s?)(\d{3,4})|(\s?[a-zA-Z]{3}\s?)(\d{2,3}))$/,
      "Is not in correct format"
    )
    .required(),
  brand: yup.object().required(),
  model: yup.object().required(),
  number_of_seats: yup.string().trim().required(),
  type: yup.object().required(),
});
export default function Home() {
  useEffect(() => {
    console.log(localStorage.getItem("jwt"));
    if (localStorage.getItem("jwt") === null) {
      router.push("/login");
    }
  }, []);

  const { jwt } = useContext(MainContext);
  const router = useRouter();
  const [defaultValues, setDefaultValues] = useState({});
  const [numberOfSeats, setNumberOfSeats] = useState(0);
  const [busType, setBusType] = useState(0);
  const [open, setOpen] = useState(false);

  const [updateOrCreate, setUpdateOrCreate] = useState(true);
  const [editId, setEditId] = useState(-1);
  const {
    handleSubmit,
    control,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(definationSchema),
    defaultValues: useMemo(() => {
      return defaultValues;
    }, [editId]),
  });
  useEffect(() => {
    reset(defaultValues);
  }, [editId]);
  const [brands, setBrands] = useState([]);

  const [types, setType] = useState([]);

  const [propertieses, setProperties] = useState([]);
  const [models, setModels] = useState([]);
  0;
  const modelsHandle = (val) => {
    axios.get("model/" + val.id).then((res) => {
      console.log(val.id);
      setModels(res.data.model);
    });
  };

  useEffect(() => {
    axios.get("bus-definition").then((res) => {
      console.log(res);
      setBrands(res.data.brand);
      setProperties(res.data.properties);
      setType(res.data.types);
    });
  }, []);

  const onSave = (data) => {
    console.log(data);
    setUpdateOrCreate(false);
    setBusType(data.type);
    setNumberOfSeats(data.number_of_seats);
    setOpen(true);
    setEditId(data.id);
    const bus = {
      plate_number: data.plaka,
      model_id: data.model.id,
      number_of_seats: parseInt(data.number_of_seats),
      type: data.type.id,
      properties: data.properties,
    };
    axios.post("bus", bus).then((res) => {
      alert("Kaydedildi");
    });
  };

  const [bus, setBus] = useState([]);

  const busUpdate = (data) => {
    console.log(data);
    console.log(data.properties);
    if (editId === -1) {
      alert("Değiştirmek istediğinizi seçin");
      return;
    }
    const editBus = {
      id: editId,
      plate_number: data.plaka,
      model_id: data.model,
      number_of_seats: parseInt(data.number_of_seats),
      proporties: data.properties,
      type: data.brand,
    };
    axios.put("bus-definition", editBus).then((res) => {
      console.log(res);
      if (res.status === 200) {
        alert("Düzenleme Başarılı");
        console.log(res);
        const newBus = bus.map((b) => {
          if (b.id === res.data.changeBus.id) {
            b.plate_number = res.data.changeBus.plaka;

            b.model_id = res.data.changeBus.model;
            b.number_of_seats = res.data.changeBus.number_of_seats;
            b.proporties = res.data.changeBus.proporties;
            b.type = res.data.changeBus.proporties;
          }
          return b;
        });
        console.log(newBus);
        setBus(newBus);
      }
    });
  };

  return (
    <Container>
      <form
        onSubmit={handleSubmit((data) =>
          updateOrCreate === true ? onSave(data) : busUpdate(data)
        )}
      >
        <Grid container direction="column">
          <Grid item pt={2}>
            <Controller
              control={control}
              name="plaka"
              render={({ field: { onChange, plaka, ref } }) => (
                <TextField
                  value={plaka}
                  onChange={onChange}
                  label="plaka"
                  variant="outlined"
                />
              )}
            />
            {errors.plaka && <p>{errors.plaka.message}</p>}
          </Grid>
          <Grid item pt={2}>
            <Controller
              control={control}
              name="brand"
              fullWidth
              render={({ field: { onChange, brand, ref } }) => (
                <Autocomplete
                  options={brands}
                  getOptionLabel={(brands) => brands.name}
                  onChange={(event, newValue) => {
                    modelsHandle(newValue);
                    onChange(newValue);
                  }}
                  value={brand}
                  fullWidth
                  renderInput={(params) => (
                    <TextField fullWidth {...params} label="Marka" />
                  )}
                />
              )}
            />
            {errors.brand && <p>{errors.brand.message}</p>}
          </Grid>
          <Grid item pt={2}>
            <Controller
              control={control}
              name="model"
              fullWidth
              render={({ field: { onChange, model, ref } }) => (
                <Autocomplete
                  options={models}
                  getOptionLabel={(models) => models.name}
                  onChange={(event, newValue) => {
                    onChange(newValue);
                  }}
                  value={model}
                  fullWidth
                  renderInput={(params) => (
                    <TextField fullWidth {...params} label="Model" />
                  )}
                />
              )}
            />
            {errors.model && <p>{errors.model.message}</p>}
          </Grid>
          <Grid item pt={2}>
            <Controller
              control={control}
              name="number_of_seats"
              render={({ field: { onChange, number_of_seats, ref } }) => (
                <TextField
                  type="number"
                  value={number_of_seats}
                  onChange={onChange}
                  label="Koltuk Sayısı"
                  variant="outlined"
                />
              )}
            />
            {errors.number_of_seats && <p>{errors.number_of_seats.message}</p>}
          </Grid>
          <Grid item pt={2}>
            <Controller
              control={control}
              name="type"
              fullWidth
              render={({ field: { onChange, type, ref } }) => (
                <Autocomplete
                  options={types}
                  getOptionLabel={(types) => types.name}
                  onChange={(event, newValue) => {
                    onChange(newValue);
                  }}
                  value={type}
                  fullWidth
                  renderInput={(params) => (
                    <TextField fullWidth {...params} label="Araç Tipi" />
                  )}
                />
              )}
            />
            {errors.type && <p>{errors.type.message}</p>}
          </Grid>
          <Grid item pt={2}>
            <Controller
              control={control}
              name="properties"
              fullWidth
              render={({ field: { onChange, properties, ref } }) => (
                <Autocomplete
                  options={propertieses}
                  getOptionLabel={(propertieses) => propertieses.name}
                  onChange={(event, newValue) => {
                    onChange(newValue);
                  }}
                  value={properties}
                  fullWidth
                  multiple
                  renderInput={(params) => (
                    <TextField fullWidth {...params} label="Araç özellikleri" />
                  )}
                />
              )}
            />
            {errors.properties && <p>{errors.properties.message}</p>}
          </Grid>
          <Grid item pt={2}>
            {updateOrCreate === true ? (
              <Button type="submit" color="success" variant="contained">
                Kaydet
              </Button>
            ) : (
              <Button type="submit" color="success" variant="contained">
                Update
              </Button>
            )}
          </Grid>
          {open && <Bus numberOfSeats={numberOfSeats} busType={busType} />}
        </Grid>
      </form>
    </Container>
  );
}
