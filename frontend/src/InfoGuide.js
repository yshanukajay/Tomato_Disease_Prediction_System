import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Card, CardContent, Typography, Grid, Avatar } from '@material-ui/core';
import PhotoCameraIcon from '@material-ui/icons/PhotoCamera';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import AssessmentIcon from '@material-ui/icons/Assessment';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';

const useStyles = makeStyles((theme) => ({
    guideContainer: {
        marginTop: '40px',
        marginBottom: '40px',
    },
    guideCard: {
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        borderRadius: '20px',
        padding: '24px',
        height: '100%',
        transition: 'all 0.3s ease',
        border: '1px solid rgba(255, 255, 255, 0.3)',
        boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
        '&:hover': {
            transform: 'translateY(-8px)',
            boxShadow: '0 16px 48px rgba(0,0,0,0.2)',
        },
    },
    iconAvatar: {
        width: 70,
        height: 70,
        margin: '0 auto 20px',
        background: 'linear-gradient(135deg, #4caf50 0%, #66bb6a 100%)',
        boxShadow: '0 4px 20px rgba(76, 175, 80, 0.4)',
    },
    stepNumber: {
        position: 'absolute',
        top: 16,
        right: 16,
        background: 'linear-gradient(135deg, #ff9800 0%, #ffa726 100%)',
        color: 'white',
        width: 32,
        height: 32,
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 700,
        fontSize: '16px',
        boxShadow: '0 4px 12px rgba(255, 152, 0, 0.4)',
    },
    stepTitle: {
        fontSize: '20px',
        fontWeight: 700,
        color: '#2c3e50',
        marginBottom: '12px',
        textAlign: 'center',
    },
    stepDescription: {
        fontSize: '15px',
        color: '#546e7a',
        lineHeight: '1.6',
        textAlign: 'center',
    },
    mainTitle: {
        fontSize: '32px',
        fontWeight: 800,
        background: 'linear-gradient(135deg, #4caf50 0%, #66bb6a 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        textAlign: 'center',
        marginBottom: '40px',
        textShadow: '0 2px 4px rgba(0,0,0,0.1)',
    },
}));

const steps = [
    {
        icon: PhotoCameraIcon,
        title: 'Capture Image',
        description: 'Take a clear photo of a tomato plant leaf with good lighting and focus.',
    },
    {
        icon: CloudUploadIcon,
        title: 'Upload Photo',
        description: 'Drag and drop your image or click to browse and select from your device.',
    },
    {
        icon: AssessmentIcon,
        title: 'AI Analysis',
        description: 'Our advanced AI model analyzes the leaf for disease patterns and symptoms.',
    },
    {
        icon: CheckCircleOutlineIcon,
        title: 'Get Results',
        description: 'Receive detailed diagnosis with disease information and treatment recommendations.',
    },
];

export const InfoGuide = () => {
    const classes = useStyles();

    return (
        <div className={classes.guideContainer}>
            <Typography className={classes.mainTitle}>
                How It Works
            </Typography>
            <Grid container spacing={3}>
                {steps.map((step, index) => (
                    <Grid item xs={12} sm={6} md={3} key={index}>
                        <Card className={classes.guideCard} style={{ position: 'relative' }}>
                            <div className={classes.stepNumber}>{index + 1}</div>
                            <CardContent>
                                <Avatar className={classes.iconAvatar}>
                                    <step.icon style={{ fontSize: 36 }} />
                                </Avatar>
                                <Typography className={classes.stepTitle}>
                                    {step.title}
                                </Typography>
                                <Typography className={classes.stepDescription}>
                                    {step.description}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </div>
    );
};

export default InfoGuide;
