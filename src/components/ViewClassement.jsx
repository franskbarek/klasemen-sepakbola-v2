import { Alert, Button, Stack } from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { classementSelectors, getClassements } from "../features/classementSlice";

export default function ViewClassement() {
  // panggil data klasemen
  const classements = useSelector(classementSelectors.selectAll);
  const dispatch = useDispatch();

  // get data klub ketika page reload
  useEffect(() => {
    dispatch(getClassements());
  }, [dispatch]);

  const [open, setOpen] = useState(true);

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div className="bg-white dark:bg-black">
      <h1 className="text-black dark:text-white underline">Detail Klasemen</h1>
      <table className="table-auto border-collapse border border-black dark:border-white">
        <thead>
          <tr>
            <th className="border border-black dark:border-white px-4 py-2 bg-gray-200 dark:bg-gray-800 text-black dark:text-white">No</th>
            <th className="border border-black dark:border-white px-4 py-2 bg-gray-200 dark:bg-gray-800 text-black dark:text-white">Klub</th>
            <th className="border border-black dark:border-white px-4 py-2 bg-gray-200 dark:bg-gray-800 text-black dark:text-white" title="Main">
              Ma
            </th>
            <th className="border border-black dark:border-white px-4 py-2 bg-gray-200 dark:bg-gray-800 text-black dark:text-white" title="Menang">
              Me
            </th>
            <th className="border border-black dark:border-white px-4 py-2 bg-gray-200 dark:bg-gray-800 text-black dark:text-white" title="Seri">
              S
            </th>
            <th className="border border-black dark:border-white px-4 py-2 bg-gray-200 dark:bg-gray-800 text-black dark:text-white" title="Kalah">
              K
            </th>
            <th className="border border-black dark:border-white px-4 py-2 bg-gray-200 dark:bg-gray-800 text-black dark:text-white" title="Gol Menang">
              GM
            </th>
            <th className="border border-black dark:border-white px-4 py-2 bg-gray-200 dark:bg-gray-800 text-black dark:text-white" title="Gol Kalah">
              GK
            </th>
            <th className="border border-black dark:border-white px-4 py-2 bg-gray-200 dark:bg-gray-800 text-black dark:text-white">Point</th>
          </tr>
        </thead>
        <tbody>
          {/* looping data klasemen */}
          {classements.map((club, idx) => (
            <tr key={club.id}>
              <td className="border border-black dark:border-white px-4 py-2 text-black dark:text-white">{idx + 1}.</td>
              <td className="border border-black dark:border-white px-4 py-2 text-black dark:text-white">{club.club}</td>
              <td className="border border-black dark:border-white px-4 py-2 text-black dark:text-white">{club.ma}</td>
              <td className="border border-black dark:border-white px-4 py-2 text-black dark:text-white">{club.me}</td>
              <td className="border border-black dark:border-white px-4 py-2 text-black dark:text-white">{club.s}</td>
              <td className="border border-black dark:border-white px-4 py-2 text-black dark:text-white">{club.k}</td>
              <td className="border border-black dark:border-white px-4 py-2 text-black dark:text-white">{club.gm}</td>
              <td className="border border-black dark:border-white px-4 py-2 text-black dark:text-white">{club.gk}</td>
              <td className="border border-black dark:border-white px-4 py-2 text-black dark:text-white">{club.point}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-2">
        {/* info start */}
        <Stack sx={{ width: "86%" }} spacing={2}>
          {open && (
            <Alert severity="info" onClose={handleClose}>
              <p className="italic">Ket: MA=Main, Me=Menang, S=Seri, K=Kalah, GM=Gol Menang, dan GK=Gol Kalah.</p>
            </Alert>
          )}
        </Stack>
      </div>
      {/* info end */}
    </div>
  );
}
