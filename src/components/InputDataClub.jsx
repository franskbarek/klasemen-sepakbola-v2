import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { classementSelectors, getClassements, saveClassement } from "../features/classementSlice";
import SaveIcon from "@mui/icons-material/Save";

export default function InputDataClub() {
  //tambahkan nama klub dan kota klub
  const [club, setClub] = useState("");
  const [city, setCity] = useState("");
  const dispatch = useDispatch();

  // get klub yang sudah terdaftar untuk di compare ketika validasi
  const clubRegistered = useSelector(classementSelectors.selectAll);

  // get data ketika page reload
  useEffect(() => {
    dispatch(getClassements());
  }, [dispatch]);

  // fungsi validasi
  const handleValidate = () => {
    // ketika tidak mengisi nama klub atau kota
    const isEmpty = club == "" || city == "";
    if (isEmpty) return toast.error("Klub dan kota wajib diisi!");

    // ketika nama klub atau kota sudah terdaftar
    const isDuplacated = clubRegistered.some((clubReg) => clubReg.club.toLowerCase() === club.toLowerCase() || clubReg.city.toLowerCase() == city.toLowerCase());
    if (isDuplacated) return toast.error("Klub dan kota sudah terdaftar, silahkan lanjut input skor!");

    return;
  };

  // simpan
  const handleSave = async (e) => {
    e.preventDefault();

    // panggil fungsi validasi
    if (handleValidate()) return;

    // simpan ke db
    await dispatch(saveClassement({ club, city }));
    toast.success("Data klub berhasil disimpan");
    setClub("");
    setCity("");
  };

  return (
    <div>
      <h1 className="underline">Input Data Klub</h1>
      <form onSubmit={handleSave}>
        <label className="block">
          <span className="block mt-2">Nama Klub:</span>
          <input className="px-2 py-1 rounded-md border border-gray-300" type="text" placeholder="Klub" value={club} onChange={(e) => setClub(e.target.value)} />
        </label>
        <label className="block">
          <span className="block mt-2">Kota Klub:</span>
          <input className="px-2 py-1 rounded-md border border-gray-300" type="text" placeholder="Kota" value={city} onChange={(e) => setCity(e.target.value)} />
        </label>
        <button>
          <div className="flex mt-2 p-2 border-2 text-sm">
            <SaveIcon />
            Simpan
          </div>
        </button>
      </form>
    </div>
  );
}
