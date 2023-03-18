import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { classementSelectors, getClassements, updateClassement } from "../features/classementSlice";
import SaveIcon from "@mui/icons-material/Save";
import AddToPhotosIcon from "@mui/icons-material/AddToPhotos";

export default function InputMultipleDataScore() {
  // get data classements
  const classements = useSelector((state) => classementSelectors.selectAll(state));

  // init match
  const initialMatch = { homeTeam: "", awayTeam: "", homeScore: 0, awayScore: 0 };

  // data form yang paling bawah yang belum disimpan
  const [match, setMatch] = useState(initialMatch);

  // data form yang sudah ditambah
  const [matchData, setMatchData] = useState([]);

  // data form keseluruhan termasuk yang belum di-add
  const [matchFormRows, setMatchFormRows] = useState([...matchData, match]);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getClassements());
  }, [dispatch]);

  // fungsi onChange event elements
  const handleOnChange = (event, rowNum) => {
    const { name, value } = event.target;
    setMatch({ ...match, [name]: value });
    const rows = [...matchFormRows];
    rows[rowNum][name] = value;
    setMatchFormRows(rows);
  };

  // validasi dupklikat
  const handleDuplicate = () => {
    const isDupclicate = match.homeTeam === match.awayTeam;
    if (isDupclicate) return toast.error("Tim yang bertanding tidak boleh sama!");
  };

  // validasi empty
  const handleEmpty = () => {
    const isEmpty = match.homeTeam === "" || match.awayTeam === "";
    if (isEmpty) return toast.error("Nama klub wajib diisi!");
  };

  // fungsi add
  const handleAddMatch = (e) => {
    e.preventDefault();
    if (handleEmpty()) return;

    if (handleDuplicate()) return;

    setMatch(initialMatch);
    setMatchData([...matchData, match]);
    setMatchFormRows([...matchData, match, initialMatch]);

    toast.success("Data berhasil ditambahkan");
    return;
  };

  // fungsi save
  const handleSaveMatch = async (e) => {
    e.preventDefault();
    if (matchData.length === 0) return toast.error("Wajib tambahkan tim ke list sebelum simpan!");

    for (let i = 0; i < matchData.length; i++) {
      const currentMatch = matchData[i];

      // proses simpan ke db
      await dispatch(updateClassement({ ...currentMatch }));
      toast.success("Data berhasil disimpan");

      setTimeout(() => {
        navigate("/");
      }, 1500);
      return;
    }
  };

  return (
    <div>
      <div className="underline">Input Multi Skor</div>
      <form>
        {matchFormRows.map((matchFormRow, idx) => (
          <div className={`pt-1${idx != matchFormRows.length - 1 ? " bg-green-300" : ""}`} key={idx}>
            <div className="containerHomeTeam">
              <span>
                <label>Klub Tim A:</label>
                <select id="homeTeam" name="homeTeam" value={matchFormRows[idx]?.homeTeam} onChange={(e) => handleOnChange(e, idx)} className="px-2 py-1 rounded-md border border-gray-300">
                  <option value="">--Pilih Tim--</option>
                  {classements &&
                    classements.map((club, idx) => (
                      <option key={idx} value={club.id}>
                        {club.club}
                      </option>
                    ))}
                </select>
              </span>
              <span className="mx-2">
                <label>Skor A:</label>
                <input type="number" id="homeScore" name="homeScore" value={matchFormRows[idx]?.homeScore} onChange={(e) => handleOnChange(e, idx)} className="px-2 py-1 rounded-md border border-gray-300" />
              </span>
            </div>
            <div className="containerAwayTeam">
              <span>
                <label>Klub Tim B:</label>
                <select id="awayTeam" name="awayTeam" value={matchFormRows[idx]?.awayTeam} onChange={(e) => handleOnChange(e, idx)} className="px-2 py-1 rounded-md border border-gray-300">
                  <option value="">--Pilih Tim--</option>
                  {classements &&
                    classements.map((club, idx) => (
                      <option key={idx} value={club.id}>
                        {club.club}
                      </option>
                    ))}
                </select>
              </span>
              <span className="mx-2">
                <label>Skor B:</label>
                <input type="number" id="awayScore" name="awayScore" value={matchFormRows[idx]?.awayScore} onChange={(e) => handleOnChange(e, idx)} className="px-2 py-1 rounded-md border border-gray-300" />
              </span>
            </div>
          </div>
        ))}
        <button className="mt-2 border-2 p-2 text-sm" type="submit" onClick={handleAddMatch}>
          <div>
            <AddToPhotosIcon />
            Tambah
          </div>
        </button>
        <button className="mt-2 mx-2 border-2 p-2 text-sm" type="submit" onClick={handleSaveMatch}>
          <div>
            <SaveIcon />
            Simpan
          </div>
        </button>
      </form>
    </div>
  );
}
