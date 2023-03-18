import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { classementSelectors, getClassements, updateClassement } from "../features/classementSlice";
import SaveIcon from "@mui/icons-material/Save";

export default function InputSingleDataScore() {
  // initial pertandingan yang pertandingan
  const [match, setMatch] = useState({ homeTeam: "", homeScore: 0, awayTeam: "", awayScore: 0 });

  // get data classments di db
  const matchData = useSelector((state) => classementSelectors.selectAll(state));
  const dispatch = useDispatch();

  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getClassements());
  }, [dispatch]);

  // fungsi validasi
  const handleValidate = () => {
    // ketika nama klub belum diisi
    const isEmpty = match.homeTeam == "" || match.awayTeam == "";
    if (isEmpty) return toast.error("Nama klub wajib diisi!");

    // ketika nama klub yang bertanding sama
    const isDuplicate = match.homeTeam == match.awayTeam;
    if (isDuplicate) return toast.error("Tim yang bertanding tidak boleh sama!");
  };

  // ketika terjadi perubahan state
  const handleOnChange = (event) => {
    const { name, value } = event.target;
    const nameElement = name;
    setMatch({ ...match, [nameElement]: value });
  };

  // simpan
  const handleSave = async (e) => {
    e.preventDefault();
    if (handleValidate()) return;
    toast.success("Data berhasil disimpan");
    await dispatch(updateClassement({ ...match }));
    setTimeout(() => {
      navigate("/");
    }, 1500);
  };

  return (
    <div>
      <div className="underline">Input Skor</div>
      {/* form input untuk 1 pertandingan saja, yaitu klub tim A, B dan skor tim A, B*/}
      <form onSubmit={handleSave}>
        <div>
          <div className="containerHomeTeam">
            <span>
              <label>Klub Tim A:</label>
              <select className="px-2 py-1 rounded-md border border-gray-300" name="homeTeam" id="homeTeam" value={match.homeTeam} onChange={handleOnChange}>
                <option value="">--Pilih Tim--</option>
                {matchData &&
                  matchData.map((club, idx) => (
                    <option key={idx} value={club.id}>
                      {club.club}
                    </option>
                  ))}
              </select>
            </span>
            <span className="mx-2">
              <label>Skor A:</label>
              <input className="px-2 py-1 rounded-md border border-gray-300" value={match.homeScore} name="homeScore" type="number" onChange={handleOnChange} />
            </span>
          </div>
          <div className="containerAwayTeam">
            <span>
              <label>Klub Tim B:</label>
              <select className="px-2 py-1 rounded-md border border-gray-300" name="awayTeam" id="awayTeam" value={match.awayTeam} onChange={handleOnChange}>
                <option value="">--Pilih Tim--</option>
                {matchData &&
                  matchData.map((club, idx) => (
                    <option key={idx} value={club.id}>
                      {club.club}
                    </option>
                  ))}
              </select>
            </span>
            <span className="mx-2">
              <label>Skor B:</label>
              <input className="px-2 py-1 rounded-md border border-gray-300" value={match.awayScore} name="awayScore" type="number" onChange={handleOnChange} />
            </span>
          </div>
        </div>
        <button type="submit">
          <div className="flex mt-2 border-2 p-2 text-sm">
            <SaveIcon />
            Simpan
          </div>
        </button>
      </form>
    </div>
  );
}
