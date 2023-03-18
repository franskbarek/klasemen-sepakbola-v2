import { useState } from "react";
import { Button, Menu, MenuItem, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import ViewListIcon from "@mui/icons-material/ViewList";
import AppRegistrationIcon from "@mui/icons-material/AppRegistration";
import ScoreboardIcon from "@mui/icons-material/Scoreboard";
import TimesOneMobiledataIcon from "@mui/icons-material/TimesOneMobiledata";
import PlusOneIcon from "@mui/icons-material/PlusOne";

export default function Navbar() {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-around h-16">
        <div className="flex items-center">
          <div className="ml-4">
            <div className="flex items-baseline space-x-4">
              <Link to="/" className="text-gray-700 hover:text-blue-800 px-3 py-2">
                <div title="Detail Klasemen">
                  <ViewListIcon />
                </div>
              </Link>
              <Link to="/input-data-klub" className="text-gray-700 hover:text-blue-800 px-3 py-2">
                <div title="Input Data Klub">
                  <AppRegistrationIcon />
                </div>
              </Link>
              <Button aria-owns={anchorEl ? "simple-menu" : undefined} aria-haspopup="true" onMouseEnter={handleOpen}>
                <Typography variant="button" className="text-gray-700 px-3 py-2 rounded-md text-medium" style={{ textTransform: "capitalize", fontSize: "17px" }}>
                  <div className="Input Skor">
                    <ScoreboardIcon />
                  </div>
                </Typography>
              </Button>
              <Menu id="simple-menu" anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose} onMouseLeave={handleClose}>
                <MenuItem component={Link} to="/input-skor" onClick={handleClose} className="text-gray-700 hover:text-blue-800 px-3 py-2 rounded-md">
                  <div className="p-2 text-sm">
                    <TimesOneMobiledataIcon />
                    Input Satu Pertandingan
                  </div>
                </MenuItem>
                <MenuItem component={Link} to="/input-multi-skor" onClick={handleClose} className="text-gray-700 hover:text-blue-800 px-3 py-2 rounded-md">
                  <div className="p-2 text-sm">
                    <PlusOneIcon />
                    Input Banyak Pertandingan
                  </div>
                </MenuItem>
              </Menu>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
