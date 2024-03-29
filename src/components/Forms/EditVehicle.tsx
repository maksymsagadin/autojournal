import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { Box, TextField, Button, Paper, Typography, Grid } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import { Vehicle } from '@/utils/types'

interface EditVehicleProps {
    vehicle: Vehicle
    onEdit: (vehicle: Vehicle) => void
    onDelete: (vehicle: Vehicle) => void
    setIsEditing: (isEditing: boolean) => void
    showSnackbar: (message: string, severity: 'success' | 'error' | 'warning' | 'info') => void
}

const EditVehicle: React.FC<EditVehicleProps> = ({ vehicle, onEdit, onDelete, setIsEditing, showSnackbar }) => {
    const { update } = useSession()
    const [editedVehicle, setEditedVehicle] = useState(vehicle)
    const [isDeleting, setIsDeleting] = useState(false)

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        event.preventDefault()
        setEditedVehicle({
            ...editedVehicle,
            [event.target.name]: event.target.value
        })
    }

    const handleSave = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        const result = await fetch('/api/vehicle/edit', {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(editedVehicle),
        })
        if (result.ok) {
            // update the local state
            onEdit(editedVehicle)
            // update the session image with updated data
            const updatedVehicles = await result.json()
            await update({ image: updatedVehicles })
            showSnackbar('Vehicle edited successfully!', 'success')
        } else {
            showSnackbar('Vehicle edit unsuccessful!', 'error')
        }
    }

    const handleDeleteVehicle = async () => {
        const result = await fetch('/api/vehicle/delete', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(vehicle),
        })
        if (result.ok) {
            // update the local state
            onDelete(vehicle)
            // update the session image with updated data
            const updatedVehicles = await result.json()
            await update({ image: updatedVehicles })
            showSnackbar('Vehicle deleted successfully!', 'success')
        } else {
            showSnackbar('Vehicle delete unsuccessful!', 'error')
        }
    }

    return (
        <Box>
            <Paper elevation={3} sx={{ p: 2, m: 2 }}>
                <Box display={'flex'} justifyContent={'center'} alignItems={'center'}>
                    <Typography variant='h5' component='h2'>
                        Edit Vehicle: {vehicle.name || `${vehicle.make} ${vehicle.model}`}
                    </Typography>
                    {isDeleting ? (
                        <>
                            <Button sx={{m: 1}} variant='contained' color='error' onClick={handleDeleteVehicle}>
                                Sure?
                            </Button>
                            <Button variant='contained' color='secondary' onClick={() => setIsDeleting(false)}>
                                No
                            </Button>
                        </>
                    ) : (
                        <Button sx={{m: 1, px:2}} variant='outlined' startIcon={<DeleteIcon />} color='error' onClick={() => setIsDeleting(prevState => !prevState)}>
                            <Typography variant='overline'>Del</Typography>
                        </Button>
                    )}
                </Box>
                <Box component='form' onSubmit={handleSave}>
                    <Grid container spacing={1}>
                        <Grid item xs={6}>
                            <TextField
                                label='Nick Name'
                                name='name'
                                type='text'
                                value={editedVehicle.name}
                                onChange={handleChange}
                                margin='dense'
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                label='Year'
                                name='year'
                                type='number'
                                value={editedVehicle.year}
                                onChange={handleChange}
                                margin='dense'
                                fullWidth
                                required
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                label='Make'
                                name='make'
                                type='text'
                                value={editedVehicle.make}
                                onChange={handleChange}
                                margin='dense'
                                fullWidth
                                required
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                label='Model'
                                name='model'
                                type='text'
                                value={editedVehicle.model}
                                onChange={handleChange}
                                margin='dense'
                                fullWidth
                                required
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                label='Color'
                                name='color'
                                type='text'
                                value={editedVehicle.color}
                                onChange={handleChange}
                                margin='dense'
                                fullWidth
                                required
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                label='Mileage'
                                name='mileage'
                                type='number'
                                value={editedVehicle.mileage}
                                onChange={handleChange}
                                margin='dense'
                                fullWidth
                                required
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Button type='submit' variant='contained' color='primary' sx={{ my: 1 }}>
                                Save
                            </Button>
                            <Button variant='contained' color='secondary' sx={{ m: 1 }} onClick={() => setIsEditing(false)}>
                                Cancel
                            </Button>
                        </Grid>
                    </Grid>
                </Box>
            </Paper>
        </Box>
    )
}

export default EditVehicle