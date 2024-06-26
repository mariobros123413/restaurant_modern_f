import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { CircularProgress, Container, Grid, Typography, Card, CardContent, TextField, Button, Dialog, DialogTitle, DialogContent, DialogActions, Snackbar } from '@mui/material';
import USUARIO_QUERY from 'src/graphql/usuario_query';
import USUARIO_MUTATION from 'src/graphql/usuario_mutations';
import USUARIO_UPDATE_MUTATION from 'src/graphql/usuario_update_mutation';
import USUARIO_DELETE_MUTATION from 'src/graphql/usuario_delete_mutations';

const Usuarios = () => {
  const { loading, error, data } = useQuery(USUARIO_QUERY);
  const [createUsuario] = useMutation(USUARIO_MUTATION);
  const [updateUsuario] = useMutation(USUARIO_UPDATE_MUTATION);
  const [deleteUsuario] = useMutation(USUARIO_DELETE_MUTATION);
  const [selectedUsuario, setSelectedUsuario] = useState('');

  const Role = {
    ADMIN: "ADMIN",
    USER: "USER"
  };
  const [nombreUsuario, setNombreUsuario] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

  const [openDialog, setOpenDialog] = useState(false);
  const [openDialogC, setOpenDialogC] = useState(false);

  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const [openDeleteConfirmation, setOpenDeleteConfirmation] = useState(false);

  const [, setOpen] = useState(false);

  const handleOpenDeleteConfirmation = (usuario) => {
    setSelectedUsuario(usuario);
    setOpenDeleteConfirmation(true);
  };

  const handleUsernameChange = (event) => {
    console.log(event.target.value)
    setNombreUsuario(event.target.value);
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleDeleteUsuario = async () => {
    try {
      await deleteUsuario({ variables: { id: selectedUsuario.id } });
      setSnackbarMessage('Usuario eliminado correctamente');
      setSnackbarOpen(true);
      setOpen(false);
      setOpenDeleteConfirmation(false);
    } catch (error) {
      console.error('Error al eliminar al usuario:', error.message);
      if (error.graphQLErrors) {
        error.graphQLErrors.forEach(({ message, locations, path }) =>
          console.error(`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`)
        );
      }
      setSnackbarMessage('Error al eliminar al usuario');
      setSnackbarOpen(true);
    }
  };

  const handleCreateUsuario = async () => {
    try {
      const roleValue = isAdmin ? Role.ADMIN : Role.USER;
      console.log(roleValue);
      console.log(nombreUsuario);
      console.log(email);
      console.log(password);
      const response = await createUsuario({
        variables: {
          usuario: {
            nombre_usuario: nombreUsuario,
            email: email,
            password: password,
            role: roleValue
          }
        }
      });
      setSnackbarMessage('Usuario creado correctamente');
      setSnackbarOpen(true);
      setOpen(false);
      console.log('Usuario creado:', response.data.createUsuario);
      setOpenDialogC(false);
    } catch (error) {
      console.error('Error al crear al usuario:', error.message);
      if (error.graphQLErrors) {
        error.graphQLErrors.forEach(({ message, locations, path }) =>
          console.error(`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`)
        );
      }
      setSnackbarMessage('Error al crear al usuario');
      setSnackbarOpen(true);
    }
  };

  const handleOpenDialog = (usuario) => {
    setSelectedUsuario(usuario);
    setNombreUsuario(usuario.nombre_usuario);
    setEmail(usuario.email);
    setPassword(usuario.password);
    setIsAdmin(usuario.role === Role.ADMIN);
    setOpenDialog(true);
  };

  const handleOpenDialogC = () => {
    setOpenDialogC(true);
  };

  const handleCloseDialogC = () => {
    setOpenDialogC(false);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedUsuario('');
  };

  const handleUpdateUsuario = async () => {
    try {
      console.log(selectedUsuario.id + '=======selectedUsuario.id');
      const roleValue = isAdmin ? Role.ADMIN : Role.USER;
      const response = await updateUsuario({
        variables: {
          usuario: {
            id: selectedUsuario.id,
            nombre_usuario: nombreUsuario.toString(),
            email: email,
            password: password,
            role: roleValue
          }
        }
      });
      setSnackbarMessage('Usuario actualizado correctamente');
      setSnackbarOpen(true);
      setOpen(false);
      console.log('Usuario actualizado:', response.data.updateUsuario);
      setOpenDialog(false);
    } catch (error) {
      console.error('Error al actualizar al usuario:', error.message);
      if (error.graphQLErrors) {
        error.graphQLErrors.forEach(({ message, locations, path }) =>
          console.error(`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`)
        );
      }
      setSnackbarMessage('Error al actualizar al usuario');
      setSnackbarOpen(true);
    }
  };

  if (loading) return <CircularProgress />;
  if (error) return <Typography>Error al cargar usuarios: {error.message}</Typography>;

  return (
    <Container>
      <Button color="primary" variant="contained" size="large" onClick={handleOpenDialogC}>
        Crear Usuario +
      </Button>
      <Typography variant="h4" gutterBottom>Usuarios</Typography>
      <Grid container spacing={4}>
        {data.getUsers.map((usuario) => (
          <Grid item xs={12} sm={6} md={4} key={usuario.id}>
            <Card>
              <CardContent>
                <Typography variant="h5">ID: {usuario.id}</Typography>
                <Typography>Nombre de Usuario: {usuario.nombre_usuario}</Typography>
                <Typography>Admin: {usuario.role}</Typography>
                <Button variant="contained" color="primary" onClick={() => handleOpenDialog(usuario)}>Editar</Button>
                <Button variant="contained" color="secondary" onClick={() => handleOpenDeleteConfirmation(usuario)}>Eliminar</Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Dialog open={openDialogC} onClose={handleCloseDialogC}>
        <DialogTitle>Crear Usuario</DialogTitle>
        <DialogContent>
          <Typography variant="h4" gutterBottom>Crear Nuevo Usuario</Typography>
          <TextField
            label="Nombre de Usuario"
            variant="outlined"
            value={nombreUsuario}
            onChange={handleUsernameChange}
          />
          <TextField
            label="Email"
            variant="outlined"
            value={email}
            onChange={handleEmailChange}
          />
          <TextField
            label="Contraseña"
            variant="outlined"
            type="password"
            value={password}
            onChange={handlePasswordChange}
          />
          <label>
            Admin:
            <input
              type="checkbox"
              checked={isAdmin}
              onChange={(e) => setIsAdmin(e.target.checked)}
            />
          </label>
          <Button variant="contained" color="primary" onClick={handleCreateUsuario}>Crear Usuario</Button>
        </DialogContent>
      </Dialog>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Editar Usuario</DialogTitle>
        <DialogContent>
          <TextField
            label="Nombre de Usuario"
            variant="outlined"
            value={nombreUsuario}
            onChange={handleUsernameChange}
          />
          <TextField
            label="Contraseña"
            variant="outlined"
            type="password"
            value={password}
            onChange={handlePasswordChange}
          />
          <label>
            Admin:
            <input
              type="checkbox"
              checked={isAdmin}
              onChange={(e) => setIsAdmin(e.target.checked)}
            />
          </label>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">Cancelar</Button>
          <Button onClick={handleUpdateUsuario} color="primary">Guardar</Button>
        </DialogActions>
      </Dialog>
      <Dialog open={openDeleteConfirmation} onClose={() => setOpenDeleteConfirmation(false)}>
        <DialogTitle>Confirmar Eliminación</DialogTitle>
        <DialogContent>
          <Typography>¿Está seguro de que desea eliminar este usuario?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteConfirmation(false)} color="primary">Cancelar</Button>
          <Button onClick={handleDeleteUsuario} color="secondary">Eliminar</Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
      />
    </Container>
  );
};

export default Usuarios;
