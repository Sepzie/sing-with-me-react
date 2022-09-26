import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

export default function FormDialog(props) {
  const [open, setOpen] = React.useState(false);
  const [title, setTitle] = React.useState();
  const [artist, setArtist] = React.useState();


  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Button variant="outlined" onClick={handleClickOpen}>
        Save synced lyrics
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Upload</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Enter the title and artist of this song to save the synced lyrics to database.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="title"
            label="Title"
            type="text"
            value={title}
            onChange={(event)=>setTitle(event.target.value)}
            fullWidth
            variant="standard"
          />
          <TextField
            margin="dense"
            id="artist"
            label="Arist"
            type="text"
            value={artist}
            onChange={(event)=>setArtist(event.target.value)}
            fullWidth
            variant="standard"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            onClick={() => {
              props.handleUpload(title, artist);
              setOpen(false);
            }}>Upload</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
