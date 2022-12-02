import { Button, Grid, TextField } from "@mui/material";
import { Container } from "@mui/system";
import * as yup from "yup";
import { useForm, Controller } from "react-hook-form";
import { useEffect, useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "next/router";
import axios from "../config/axios";
import { MainContext, useContext } from "../context";

const userSchema = yup.object().shape({
  email: yup
    .string("Geçersiz Değer Girdin")
    .email("Lütfen e posta gir")
    .required("Lütfen zorunlu alanları doldurunuz"),
  password: yup
    .string("Geçersiz Değer Girdin")
    .required("Lütfen zorunlu alanları doldurunuz"),
});

export default function Login() {
  const { setJwt } = useContext(MainContext);

  const [defaultValues, setDefaultValues] = useState({
    email: "",
    password: "",
  });
  const {
    handleSubmit,
    control,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(userSchema),
    defaultValues,
  });

  const router = useRouter();

  const onLogin = (data) => {
    console.log(data);
    axios.post("login", data).then((res) => {
      if (res.status === 200) {
        console.log(res);
        localStorage.setItem("jwt", res.data.data);
        setJwt(res.data.data);
        router.push("/");
      } else {
        alert("Başarısız");
      }
    });
  };

  return (
    <Container maxWidth="sm">
      <form onSubmit={handleSubmit((data) => onLogin(data))}>
        <Grid
          mt={20}
          sx={{ border: 1 }}
          container
          spacing={0}
          direction="column"
          alignItems="center"
          justifyContent="center"
        >
          <Grid item pt={2}>
            <label>eposta</label>
          </Grid>
          <Grid item pt={2}>
            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, value, ref } }) => (
                <TextField
                  variant="outlined"
                  value={value}
                  onChange={onChange}
                />
              )}
            />
            {errors.eposta && <p>{errors.eposta.message}</p>}
          </Grid>
          <Grid item pt={2}>
            <label>Password</label>
          </Grid>
          <Grid item pt={2}>
            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, value, ref } }) => (
                <TextField
                  type={"password"}
                  variant="outlined"
                  value={value}
                  onChange={onChange}
                />
              )}
            />
            {errors.password && <p>{errors.password.message}</p>}
          </Grid>
          <Grid item pt={2}>
            <Button type="submit" variant="contained" color="success">
              Login
            </Button>
          </Grid>
        </Grid>
      </form>
    </Container>
  );
}
