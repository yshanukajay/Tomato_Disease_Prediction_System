import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Typography, Container, Link, Grid } from '@material-ui/core';
import GitHubIcon from '@material-ui/icons/GitHub';
import FavoriteIcon from '@material-ui/icons/Favorite';

const useStyles = makeStyles((theme) => ({
    footer: {
        background: 'linear-gradient(135deg, rgba(56, 142, 60, 0.95) 0%, rgba(76, 175, 80, 0.95) 100%)',
        backdropFilter: 'blur(20px)',
        color: 'white',
        padding: '32px 0',
        marginTop: '60px',
        borderTop: '1px solid rgba(255,255,255,0.1)',
        position: 'relative',
        zIndex: 1,
    },
    footerContent: {
        textAlign: 'center',
    },
    footerText: {
        color: 'rgba(255,255,255,0.9)',
        fontSize: '14px',
        marginBottom: '12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
    },
    footerLink: {
        color: 'rgba(255,255,255,0.8)',
        textDecoration: 'none',
        transition: 'color 0.3s ease',
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
        '&:hover': {
            color: '#ffffff',
        },
    },
    copyright: {
        color: 'rgba(255,255,255,0.7)',
        fontSize: '13px',
        marginTop: '16px',
    },
    badge: {
        background: 'rgba(255,255,255,0.15)',
        padding: '6px 16px',
        borderRadius: '20px',
        fontSize: '12px',
        fontWeight: 600,
        display: 'inline-block',
        marginTop: '12px',
    },
}));

export const Footer = () => {
    const classes = useStyles();

    return (
        <footer className={classes.footer}>
            <Container className={classes.footerContent}>
                <Typography className={classes.footerText}>
                    Made with <FavoriteIcon style={{ color: '#ff9800', fontSize: '18px' }} /> using Deep Learning & React
                </Typography>
                <div className={classes.badge}>
                    🤖 Powered by TensorFlow & AI
                </div>
                <Typography className={classes.copyright}>
                    © {new Date().getFullYear()} Tomato Disease Classification System. All rights reserved.
                </Typography>
            </Container>
        </footer>
    );
};

export default Footer;
