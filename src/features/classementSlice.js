import { createAsyncThunk, createEntityAdapter, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const URL_JSON_SERVER = "http://localhost:5000/classements";

// get all dan sorting berdasarkan menang dan point
export const getClassements = createAsyncThunk("classements/getClassements", async () => {
  const matchs = await axios.get(`${URL_JSON_SERVER}?_sort=point,me&_order=desc,asc}`);
  return matchs.data;
});

// simpan klub dan kota
export const saveClassement = createAsyncThunk("classements/saveClassements", async ({ club, city }) => {
  const initTeam = {
    club,
    city,
    ma: 0,
    me: 0,
    s: 0,
    k: 0,
    gm: 0,
    gk: 0,
    point: 0,
  };
  const response = await axios.post(URL_JSON_SERVER, initTeam);
  return response.data;
});

// input skor pertandingan dan kalkulasi skor
export const updateClassement = createAsyncThunk("classements/updateClassement", async ({ homeTeam, homeScore, awayTeam, awayScore }) => {
  const { data: homeTeamDetail } = await axios.get(`${URL_JSON_SERVER}/${homeTeam}`);
  const { data: awayTeamDetail } = await axios.get(`${URL_JSON_SERVER}/${awayTeam}`);

  // init rule kalkulasi klasemen, jika main: MA + 1, menang: ME + 3, seri: S + 1 masing2 klub, k: K + 1 untuk klub kalah
  const INIT_NUMBER_RULE = {
    MA: 1,
    ME: 3,
    S: 1,
    K: 1,
  };

  // init homeTeam from match payload
  const homeTeamUpdatePayload = {
    id: homeTeamDetail.id,
    club: homeTeamDetail.club,
    city: homeTeamDetail.city,
    ma: Number(homeTeamDetail.ma) + INIT_NUMBER_RULE.MA,
    me: Number(homeTeamDetail.me),
    s: Number(homeTeamDetail.s),
    k: Number(homeTeamDetail.k),
    gm: Number(homeTeamDetail.gm) + Number(homeScore),
    gk: Number(homeTeamDetail.gk) + Number(awayScore),
    point: Number(homeTeamDetail.point),
  };

  // init awayTeam from match payload
  const awayTeamUpdatePayload = {
    id: awayTeamDetail.id,
    club: awayTeamDetail.club,
    city: awayTeamDetail.city,
    ma: Number(awayTeamDetail.ma) + INIT_NUMBER_RULE.MA,
    me: Number(awayTeamDetail.me),
    s: Number(awayTeamDetail.s),
    k: Number(awayTeamDetail.k),
    gm: Number(awayTeamDetail.gm) + Number(awayScore),
    gk: Number(awayTeamDetail.gk) + Number(homeScore),
    point: Number(awayTeamDetail.point),
  };

  // setup pertandingan jumlah menang, seri, kalah dan point

  // case pertandingan seri
  if (homeScore == awayScore) {
    homeTeamUpdatePayload.s = homeTeamDetail.s + INIT_NUMBER_RULE.S;
    awayTeamUpdatePayload.s = awayTeamDetail.s + INIT_NUMBER_RULE.S;
    homeTeamUpdatePayload.point = homeTeamDetail.point + INIT_NUMBER_RULE.S;
    awayTeamUpdatePayload.point = awayTeamDetail.point + INIT_NUMBER_RULE.S;
  }

  // case homeTeam menang
  if (homeScore > awayScore) {
    homeTeamUpdatePayload.me = homeTeamDetail.me + INIT_NUMBER_RULE.MA;
    homeTeamUpdatePayload.point = homeTeamDetail.point + INIT_NUMBER_RULE.ME;
    awayTeamUpdatePayload.k = awayTeamDetail.k + INIT_NUMBER_RULE.K;
  }

  // case awayTeam menang
  if (awayScore > homeScore) {
    awayTeamUpdatePayload.me = awayTeamDetail.me + INIT_NUMBER_RULE.MA;
    awayTeamUpdatePayload.point = awayTeamDetail.point + INIT_NUMBER_RULE.ME;
    homeTeamUpdatePayload.k = homeTeamDetail.k + INIT_NUMBER_RULE.K;
  }

  // update data di db
  const updateHomeTeamResponse = await axios.patch(`${URL_JSON_SERVER}/${homeTeamUpdatePayload.id}`, homeTeamUpdatePayload);
  const updateAwayTeamResponse = await axios.patch(`${URL_JSON_SERVER}/${awayTeamUpdatePayload.id}`, awayTeamUpdatePayload);

  return updateHomeTeamResponse.data;
});

const classementEntity = createEntityAdapter({
  classementId: (classement) => classement.id,
});

const classementSlice = createSlice({
  name: "classement",
  initialState: classementEntity.getInitialState(),
  // upgraded callback builder RTK **tanpa cb builder sudah deprecated!
  extraReducers: (builder) => {
    builder
      .addCase(getClassements.fulfilled, (state, action) => {
        classementEntity.setAll(state, action.payload);
      })
      .addCase(saveClassement.fulfilled, (state, action) => {
        classementEntity.addOne(state, action.payload);
      })
      .addCase(updateClassement.fulfilled, (state, action) => {
        classementEntity.updateOne(state, { id: action.payload.id, updates: action.payload });
      });
  },
});

export const classementSelectors = classementEntity.getSelectors((state) => state.classement);
export default classementSlice.reducer;
