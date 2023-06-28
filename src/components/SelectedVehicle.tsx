import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { Box, Typography, Grid } from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import { JournalEntry, Vehicle } from '@/utils/types'
import EditVehicle from '@/components/Forms/EditVehicle'
import AddJournalEntry from './Forms/AddJournalEntry'
import JournalEntryCard from '@/components/JournalEntryCard'

interface SelectedVehicleProps {
    vehicle: Vehicle,
    onEdit: (vehicle: Vehicle) => void
    onDelete: (vehicle: Vehicle) => void
}

const SelectedVehicle: React.FC<SelectedVehicleProps> = ({ vehicle, onEdit, onDelete }) => {
    const { update } = useSession()

    const handleEditEntry = async (updatedEntry: JournalEntry) => {
        // Check if the mileage is higher than the current vehicle's mileage and update it
        if (Number(updatedEntry.mileage) > Number(vehicle.mileage)) {
            vehicle.mileage = updatedEntry.mileage
        }

        // Update vehicle with the updated journal entry
        const entryIndex = vehicle.journalEntries.findIndex(entry => entry.id === updatedEntry.id)
        const updatedEntries = [...vehicle.journalEntries]
        updatedEntries[entryIndex] = updatedEntry
        const updatedVehicle = { ...vehicle, journalEntries: updatedEntries }

        // Update Vehicle
        // Call your API endpoint to update server data
        const result = await fetch('/api/vehicle/edit', {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedVehicle),
        })
        if (result.ok) {
            // If the server responded with a success status
            // update the local state
            onEdit(updatedVehicle)
            
            // update the session image with updated data
            const updatedVehicles = await result.json()
            await update({ image: updatedVehicles })
        } else {
            // If the server responded with an error status, handle the error
            console.error('Error editing vehicle')
        }
    }

    const handleDeleteEntry = async (entryToDelete: JournalEntry) => {
        const updatedEntries = vehicle.journalEntries.filter(entry => entry.id !== entryToDelete.id)
        const updatedVehicle = { ...vehicle, journalEntries: updatedEntries }
        
        // Update Vehicle
        // Call your API endpoint to update server data
        const result = await fetch('/api/vehicle/edit', {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedVehicle),
        })
        if (result.ok) {
            // If the server responded with a success status
            // update the local state
            onEdit(updatedVehicle)
            
            // update the session image with updated data
            const updatedVehicles = await result.json()
            await update({ image: updatedVehicles })
        } else {
            // If the server responded with an error status, handle the error
            console.error('Error editing vehicle')
        }
    }

    return (
        <Box>
            <Box display='flex' justifyContent='center'>
                <Typography variant="h5" component="h2">
                    Selected Vehicle: {vehicle.name || `${vehicle.make} ${vehicle.model}`}
                </Typography>
                <EditVehicle vehicle={vehicle} onEdit={onEdit} onDelete={onDelete} />
            </Box>
            <Typography variant="h5" component="h4">
                Vehicle: {vehicle.make} {vehicle.model}
            </Typography>
            <Typography variant="body1" component="p">
                Year: {vehicle.year}
            </Typography>
            <Typography variant="body1" component="p">
                Color: {vehicle.color}
            </Typography>
            <Typography variant="body1" component="p">
                Mileage: {vehicle.mileage}
            </Typography>
            <AddJournalEntry vehicle={vehicle} onAddEntry={onEdit} />
            <Grid container>
                {vehicle.journalEntries.map((entry, index) => (
                    <Grid item xs={12} md={6} lg={4} xl={3} key={index}>
                        <JournalEntryCard entry={entry} onEdit={handleEditEntry} onDelete={handleDeleteEntry}/>
                    </Grid>
                ))}
            </Grid>
        </Box>
    )
}

export default SelectedVehicle