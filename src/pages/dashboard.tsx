import { NextPage, GetServerSideProps } from 'next'
import { useState } from 'react'
import Head from 'next/head'
import type { Session } from 'next-auth'
import { authOptions } from './api/auth/[...nextauth]'
import { getServerSession } from 'next-auth/next'
import { useSession } from 'next-auth/react'

import { Box, Typography, Grid, Button, Snackbar, Alert } from '@mui/material'
import Downloading from '@mui/icons-material/DownloadingOutlined'
import SportsMotorsportsIcon from '@mui/icons-material/SportsMotorsports'

import NavBar from '@/components/NavBar'
import AddVehicle from '@/components/Forms/AddVehicle'
import VehicleCard from '@/components/VehicleCard'
import SelectedVehicle from '@/components/SelectedVehicle'
import useSnackbar from '@/hooks/useSnackbar'
import { Vehicle } from '@/utils/types'

const Dashboard: NextPage = () => {
    const { data: session, status } = useSession({required: true})
    const [vehicles, setVehicles] = useState<Vehicle[]>(session.user.image as any as Vehicle[] || [])
    const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null)
    const [showVehicles, setShowVehicles] = useState(true)
    const user = session?.user
    const {
        snackbarOpen,
        snackbarMessage,
        snackbarSeverity,
        showSnackbar,
        closeSnackbar
    } = useSnackbar()

    // Handle State after Adding a vehicle
    const handleAddVehicle = (newVehicle: Vehicle) => {
        setVehicles(prevVehicles => [...prevVehicles, newVehicle])
    }
    // Handle State after Selecting a vehicle
    const handleSelectVehicle = (vehicle: Vehicle) => {
        setSelectedVehicle(vehicle)
        setShowVehicles(false)
    }
    // Handle State after Editing a vehicle
    const handleEditVehicle = (editedVehicle: Vehicle) => {
        setVehicles(prevVehicles => 
            prevVehicles.map(vehicle => 
                vehicle.id === editedVehicle.id ? editedVehicle : vehicle
            )
        )
        if (selectedVehicle.id === editedVehicle.id) {
            setSelectedVehicle(editedVehicle)
        }
    }
    // Handle State after Deleting a vehicle
    const handleDeleteVehicle = (deletedVehicle: Vehicle) => {
        setVehicles(prevVehicles => 
            prevVehicles.filter(vehicle => vehicle.id !== deletedVehicle.id)
        )
        if (selectedVehicle.id === deletedVehicle.id) {
            setShowVehicles(true)
            setSelectedVehicle(null)
        }
    }

    if (status === 'loading') {
        return <Box><Downloading /></Box>
    }
    if (!session) {
        return <Box>Error: Not logged in</Box>
    }
    
    return (
        <>  
            <Head>
                <title>🏎️ - AutoJournal</title>
                <meta name='description' content='Your personal vehicle dashboard on AutoJournal' />
            </Head>
            <NavBar />
            <Box textAlign={'center'} mt={4} mx={1}>
                {showVehicles ? (
                    <>
                        <Typography variant='h4' component='h1' gutterBottom>
                            Welcome, <SportsMotorsportsIcon /> {user?.name}
                        </Typography>
                        <Box alignItems='center' mb={2}>
                            <Typography variant='h6' component='h2' gutterBottom>
                                You have {vehicles?.length} vehicles.
                            </Typography>
                            <AddVehicle onAddVehicle={handleAddVehicle} showSnackbar={showSnackbar} />
                        </Box>
                        <Grid display='flex' justifyContent='center' container spacing={2}>
                            {vehicles?.map((vehicle: Vehicle, index: number) => (
                                <Grid item key={index}>
                                    <VehicleCard 
                                        vehicle={vehicle} 
                                        onSelect={handleSelectVehicle}
                                    />
                                </Grid>
                            ))}
                        </Grid>
                    </>
                ) : (
                    <>
                        <Button variant='outlined' color='warning' sx={{mb:2}} onClick={() => setShowVehicles(true)}>Select Vehicle</Button>
                        <SelectedVehicle vehicle={selectedVehicle} onEdit={handleEditVehicle} onDelete={handleDeleteVehicle} showSnackbar={showSnackbar}/>
                    </>
                )}
            </Box>
            <Snackbar 
                open={snackbarOpen} 
                autoHideDuration={6000} 
                onClose={closeSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
            >
                <Alert onClose={closeSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </>
        
    )
}

export const getServerSideProps: GetServerSideProps<{ session: Session | null }> = async (context) => {
    const session = await getServerSession(context.req, context.res, authOptions)

    if (!session) {
        return {
            redirect: {
                destination: '/log-in',
                permanent: false,
            },
        }
    }

    return {
        props: {
            session,
        },
    }
}

export default Dashboard