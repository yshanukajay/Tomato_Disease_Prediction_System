import { useState, useEffect } from "react";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Avatar from "@material-ui/core/Avatar";
import Container from "@material-ui/core/Container";
import React from "react";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import { Paper, CardActionArea, CardMedia, Grid, TableContainer, Table, TableBody, TableHead, TableRow, TableCell, Button, CircularProgress, Chip, Fade, Zoom } from "@material-ui/core";
import image from "./bg.png";
import { DropzoneArea } from 'material-ui-dropzone';
import Clear from '@material-ui/icons/Clear';
import InfoIcon from '@material-ui/icons/Info';
import AutorenewIcon from '@material-ui/icons/Autorenew';
import RefreshIcon from '@material-ui/icons/Refresh';
import axios from 'axios';
import { InfoGuide } from './InfoGuide';
import { Footer } from './Footer';

// Disease information database
const diseaseInfo = {
  "Tomato_Bacterial_spot": {
    description: "Bacterial leaf spot causes dark spots with yellow halos on leaves and fruit.",
    symptoms: "Small brown spots with yellow halos, defoliation",
    treatment: "Use copper-based bactericides, remove infected plants, practice crop rotation"
  },
  "Tomato_Early_blight": {
    description: "Fungal disease causing brown spots with concentric rings (target-like pattern).",
    symptoms: "Brown circular spots with concentric rings, yellowing leaves",
    treatment: "Apply fungicides, remove infected leaves, improve air circulation"
  },
  "Tomato_Late_blight": {
    description: "Destructive fungal disease that can rapidly destroy entire plants.",
    symptoms: "Water-soaked lesions, white fungal growth, rapid plant death",
    treatment: "Apply fungicides preventatively, destroy infected plants immediately"
  },
  "Tomato_Leaf_Mold": {
    description: "Fungal disease that thrives in humid conditions with poor air flow.",
    symptoms: "Yellow spots on upper leaf surface, olive-green mold underneath",
    treatment: "Reduce humidity, improve ventilation, apply fungicides if needed"
  },
  "Tomato_Septoria_leaf_spot": {
    description: "Common fungal disease causing numerous small spots on leaves.",
    symptoms: "Small circular spots with dark borders and gray centers",
    treatment: "Remove infected leaves, apply fungicides, use mulch to prevent splash"
  },
  "Tomato_Spider_mites": {
    description: "Tiny pests that suck plant juices, causing stippling and webbing.",
    symptoms: "Yellow stippling on leaves, fine webbing, bronze appearance",
    treatment: "Use miticides, spray with water, introduce predatory mites"
  },
  "Tomato_Target_Spot": {
    description: "Fungal disease causing concentric ring patterns on leaves and fruit.",
    symptoms: "Brown spots with concentric rings, defoliation",
    treatment: "Apply fungicides, remove infected debris, practice crop rotation"
  },
  "Tomato_Yellow_Leaf_Curl_Virus": {
    description: "Viral disease transmitted by whiteflies, causing severe stunting.",
    symptoms: "Leaf yellowing, curling, stunted growth, reduced fruit production",
    treatment: "Control whiteflies, remove infected plants, use resistant varieties"
  },
  "Tomato_mosaic_virus": {
    description: "Viral disease causing mottled, distorted leaves and reduced yields.",
    symptoms: "Mottled light and dark green patterns, leaf distortion",
    treatment: "Remove infected plants, disinfect tools, use virus-free seeds"
  },
  "Tomato_healthy": {
    description: "Your tomato plant appears healthy with no signs of disease!",
    symptoms: "Green, vigorous foliage with no discoloration or damage",
    treatment: "Continue regular care: water consistently, fertilize, monitor for pests"
  }
};

const ColorButton = withStyles((theme) => ({
  root: {
    color: "#ffffff",
    background: "linear-gradient(45deg, #4caf50 30%, #66bb6a 90%)",
    borderRadius: "8px",
    textTransform: "none",
    fontWeight: 600,
    padding: "12px 32px",
    boxShadow: "0 3px 5px 2px rgba(76, 175, 80, .3)",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    '&:hover': {
      background: "linear-gradient(45deg, #388e3c 30%, #4caf50 90%)",
      boxShadow: "0 6px 10px 2px rgba(76, 175, 80, .4)",
      transform: "translateY(-2px)",
    },
    '&:active': {
      transform: "translateY(0px)",
    },
  },
}))(Button);

const useStyles = makeStyles((theme) => ({
  heroBanner: {
    textAlign: 'center',
    padding: '60px 24px 40px',
    background: 'linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(76, 175, 80, 0.03) 100%)',
    animation: 'fadeIn 1s ease-out',
  },
  heroTitle: {
    fontWeight: 800,
    color: '#ffffff',
    marginBottom: '16px',
    textShadow: '0 4px 20px rgba(0,0,0,0.3), 0 2px 8px rgba(0,0,0,0.2)',
    letterSpacing: '-0.5px',
  },
  heroSubtitle: {
    color: 'rgba(255,255,255,0.95)',
    fontWeight: 500,
    textShadow: '0 2px 12px rgba(0,0,0,0.3)',
  },
  featureCard: {
    background: 'linear-gradient(145deg, rgba(255,255,255,0.95), rgba(248,251,248,0.95))',
    backdropFilter: 'blur(20px)',
    borderRadius: '20px',
    padding: '28px 20px',
    textAlign: 'center',
    border: '2px solid rgba(76, 175, 80, 0.2)',
    boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    '&:hover': {
      transform: 'translateY(-8px)',
      boxShadow: '0 16px 48px rgba(76, 175, 80, 0.25)',
      borderColor: 'rgba(76, 175, 80, 0.4)',
    },
  },
  featureIcon: {
    fontSize: '42px',
    marginBottom: '12px',
  },
  featureTitle: {
    fontSize: '16px',
    fontWeight: 700,
    color: '#1b5e20',
    marginBottom: '6px',
  },
  featureText: {
    fontSize: '13px',
    color: '#546e7a',
    fontWeight: 500,
  },
  customDropzone: {
    minHeight: '180px !important',
    border: '3px dashed rgba(76, 175, 80, 0.3) !important',
    borderRadius: '16px !important',
    background: 'linear-gradient(135deg, rgba(248,251,248,0.5), rgba(240,248,245,0.5)) !important',
    transition: 'all 0.3s ease !important',
    '&:hover': {
      borderColor: 'rgba(76, 175, 80, 0.6) !important',
      background: 'linear-gradient(135deg, rgba(248,251,248,0.8), rgba(240,248,245,0.8)) !important',
    },
  },
  loadingContainer: {
    textAlign: 'center',
    padding: '48px 32px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '20px',
  },
  loadingTitle: {
    fontSize: '24px',
    fontWeight: 700,
    color: '#1b5e20',
    marginTop: '20px',
  },
  loadingSubtitle: {
    fontSize: '15px',
    color: '#546e7a',
    fontWeight: 500,
  },
  loadingSteps: {
    marginTop: '32px',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    alignItems: 'flex-start',
    width: '100%',
    maxWidth: '320px',
  },
  loadingStep: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  loadingStepIcon: {
    width: '28px',
    height: '28px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #4caf50, #66bb6a)',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '14px',
    fontWeight: 700,
    boxShadow: '0 4px 12px rgba(76, 175, 80, 0.3)',
  },
  loadingStepIconPending: {
    width: '28px',
    height: '28px',
    borderRadius: '50%',
    background: '#e0e0e0',
    color: '#9e9e9e',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '20px',
  },
  loadingStepText: {
    fontSize: '15px',
    color: '#1b5e20',
    fontWeight: 600,
  },
  loadingStepTextPending: {
    fontSize: '15px',
    color: '#9e9e9e',
    fontWeight: 500,
  },
  grow: {
    flexGrow: 1,
  },
  clearButton: {
    width: "100%",
    borderRadius: "8px",
    padding: "12px 24px",
    color: "#ffffff",
    fontSize: "16px",
    fontWeight: 600,
    textTransform: "none",
    background: "linear-gradient(45deg, #4caf50 30%, #66bb6a 90%)",
    boxShadow: "0 3px 5px 2px rgba(76, 175, 80, .3)",
    transition: "all 0.3s ease",
    '&:hover': {
      background: "linear-gradient(45deg, #388e3c 30%, #4caf50 90%)",
      boxShadow: "0 4px 8px 2px rgba(76, 175, 80, .4)",
      transform: "translateY(-1px)",
    },
  },
  root: {
    maxWidth: 500,
    flexGrow: 1,
  },
  media: {
    height: 420,
    borderRadius: "30px 30px 0 0",
    position: 'relative',
    boxShadow: '0 6px 24px rgba(0,0,0,0.15)',
    '&::after': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.04) 100%)',
      pointerEvents: 'none',
    },
  },
  paper: {
    padding: theme.spacing(3),
    margin: 'auto',
    maxWidth: 600,
    borderRadius: "16px",
    boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
  },
  gridContainer: {
    justifyContent: "center",
    padding: "3em 1.5em",
    minHeight: "calc(100vh - 90px)",
    display: "flex",
    alignItems: "center",
  },
  mainContainer: {
    backgroundImage: `url(${image})`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    backgroundSize: 'cover',
    backgroundAttachment: 'fixed',
    minHeight: "100vh",
    paddingTop: "0px",
    position: 'relative',
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.4)',
      zIndex: 0,
    },
    '& > *': {
      position: 'relative',
      zIndex: 1,
    },
  },
  diseasesCard: {
    margin: "auto",
    maxWidth: 520,
    marginBottom: 28,
    padding: theme.spacing(4),
    background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.98) 0%, rgba(248, 251, 248, 0.98) 100%)',
    backdropFilter: 'blur(25px)',
    boxShadow: '0 12px 48px rgba(76, 175, 80, 0.2), 0 2px 8px rgba(0,0,0,0.08)',
    borderRadius: '28px',
    border: '3px solid rgba(76, 175, 80, 0.25)',
    position: 'relative',
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: '4px',
      background: 'linear-gradient(90deg, #2e7d32 0%, #4caf50 50%, #66bb6a 100%)',
      borderRadius: '28px 28px 0 0',
    },
  },
  diseasesTitle: {
    color: '#1b5e20',
    fontWeight: 800,
    marginBottom: theme.spacing(2.5),
    fontSize: '1.35rem',
    letterSpacing: '0.5px',
  },
  diseaseItem: {
    color: '#37474f',
    fontSize: '1rem',
    lineHeight: 2.2,
    fontWeight: 600,
    display: 'flex',
    alignItems: 'center',
    '&::before': {
      content: '""',
      display: 'inline-block',
      width: '6px',
      height: '6px',
      borderRadius: '50%',
      background: '#4caf50',
      marginRight: '12px',
      marginLeft: '-2px',
    },
  },
  imageCard: {
    margin: "auto",
    maxWidth: 520,
    minHeight: 420,
    background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.98) 0%, rgba(249, 251, 248, 0.98) 100%)',
    backdropFilter: 'blur(25px)',
    boxShadow: '0 24px 72px rgba(0,0,0,0.18), 0 4px 16px rgba(76, 175, 80, 0.15), inset 0 1px 0 rgba(255,255,255,0.9)',
    borderRadius: '32px',
    transition: "all 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
    overflow: "hidden",
    border: '3px solid transparent',
    backgroundImage: 'linear-gradient(145deg, rgba(255, 255, 255, 0.98), rgba(249, 251, 248, 0.98)), linear-gradient(135deg, #4caf50 0%, #66bb6a 25%, #81c784 50%, #aed581 75%, #4caf50 100%)',
    backgroundOrigin: 'border-box',
    backgroundClip: 'padding-box, border-box',
    position: 'relative',
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      borderRadius: '32px',
      padding: '3px',
      background: 'linear-gradient(135deg, #4caf50, #66bb6a, #81c784, #aed581)',
      WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
      WebkitMaskComposite: 'xor',
      maskComposite: 'exclude',
      opacity: 0.5,
      animation: 'borderRotate 5s linear infinite',
    },
    '&:hover': {
      transform: "translateY(-16px) scale(1.02)",
      boxShadow: '0 32px 96px rgba(76, 175, 80, 0.35), 0 8px 32px rgba(102, 187, 106, 0.25), inset 0 1px 0 rgba(255,255,255,1)',
      '&::before': {
        opacity: 1,
      },
    },
  },
  imageCardEmpty: {
    minHeight: 300,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  noImage: {
    margin: "auto",
    width: 400,
    height: "400 !important",
  },
  input: {
    display: 'none',
  },
  uploadIcon: {
    background: 'white',
  },
  tableContainer: {
    backgroundColor: 'transparent',
    boxShadow: 'none',
    margin: "16px 0",
  },
  table: {
    backgroundColor: 'transparent',
    minWidth: 200,
  },
  tableHead: {
    backgroundColor: '#f8f9fa',
  },
  tableRow: {
    '&:nth-of-type(odd)': {
      backgroundColor: '#f8f9fa',
    },
    '&:hover': {
      backgroundColor: '#e3f2fd',
    },
  },
  tableCell: {
    fontSize: '18px',
    fontWeight: 600,
    color: '#2c3e50',
    padding: '16px',
    borderBottom: '1px solid #e0e0e0',
  },
  tableCell1: {
    fontSize: '14px',
    fontWeight: 700,
    color: '#546e7a',
    padding: '12px 16px',
    backgroundColor: '#f5f5f5',
    borderBottom: '2px solid #e0e0e0',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  tableBody: {
    backgroundColor: 'transparent',
  },
  text: {
    color: 'white !important',
    textAlign: 'center',
    fontWeight: 500,
  },
  buttonGrid: {
    maxWidth: "500px",
    width: "100%",
    marginTop: "24px",
  },
  analyzeButton: {
    width: "100%",
    borderRadius: "16px",
    padding: "16px 32px",
    color: "#ffffff",
    fontSize: "16px",
    fontWeight: 700,
    textTransform: "none",
    background: "linear-gradient(135deg, #4caf50 0%, #66bb6a 50%, #81c784 100%)",
    backgroundSize: "200% 100%",
    boxShadow: "0 6px 20px rgba(76, 175, 80, .4), inset 0 1px 0 rgba(255,255,255,0.3)",
    border: "2px solid rgba(255, 255, 255, 0.3)",
    transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
    position: "relative",
    overflow: "hidden",
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: '-100%',
      width: '100%',
      height: '100%',
      background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
      transition: 'left 0.5s',
    },
    '&:hover': {
      background: "linear-gradient(135deg, #388e3c 0%, #4caf50 50%, #66bb6a 100%)",
      backgroundPosition: "100% 0",
      boxShadow: "0 8px 28px rgba(76, 175, 80, .6), inset 0 1px 0 rgba(255,255,255,0.4)",
      transform: "translateY(-3px) scale(1.02)",
      '&::before': {
        left: '100%',
      },
    },
    '&:active': {
      transform: "translateY(-1px) scale(1.01)",
    },
  },
  detail: {
    background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.98) 0%, rgba(248, 250, 252, 0.98) 100%)',
    backdropFilter: 'blur(20px)',
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    alignItems: 'center',
    padding: "40px",
    borderRadius: "0 0 30px 30px",
    borderTop: "2px solid rgba(76, 175, 80, 0.2)",
    boxShadow: 'inset 0 2px 8px rgba(76, 175, 80, 0.1)',
  },
  appbar: {
    background: "linear-gradient(135deg, rgba(46, 125, 50, 0.98) 0%, rgba(56, 142, 60, 0.98) 50%, rgba(76, 175, 80, 0.98) 100%)",
    backdropFilter: "blur(25px)",
    boxShadow: "0 10px 40px rgba(0,0,0,0.25), 0 2px 8px rgba(0,0,0,0.1)",
    color: 'white',
    height: "90px",
    justifyContent: "center",
    borderBottom: "2px solid rgba(255,255,255,0.15)",
  },
  toolbar: {
    height: "90px",
    padding: "0 40px",
    maxWidth: '1400px',
    width: '100%',
    margin: '0 auto',
  },
  title: {
    fontSize: "20px",
    fontWeight: 800,
    fontFamily: "'Inter', 'Poppins', sans-serif",
    letterSpacing: "0.3px",
    lineHeight: 1.2,
  },
  logoContainer: {
    background: 'white',
    borderRadius: '14px',
    padding: '6px',
    boxShadow: '0 8px 24px rgba(0,0,0,0.2), 0 0 0 3px rgba(255,255,255,0.2)',
    transition: 'all 0.3s ease',
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 12px 32px rgba(0,0,0,0.3), 0 0 0 3px rgba(255,255,255,0.3)',
    },
  },
  logo: {
    width: 56,
    height: 56,
    border: 'none',
  },
  loader: {
    color: '#2196f3',
    marginBottom: "16px",
  },
  loadingText: {
    color: '#546e7a',
    fontWeight: 500,
    fontSize: '18px',
  },
  dropzoneContainer: {
    padding: "56px 40px",
    minHeight: "400px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(135deg, rgba(248,250,252,0.98) 0%, rgba(241,245,249,0.98) 50%, rgba(237,242,250,0.98) 100%)",
    backdropFilter: "blur(20px)",
    borderRadius: "28px",
    margin: "20px",
    boxShadow: 'inset 0 2px 20px rgba(76, 175, 80, 0.08)',
  },
  confidenceHigh: {
    color: '#4caf50',
    fontWeight: 700,
  },
  confidenceMedium: {
    color: '#ff9800',
    fontWeight: 700,
  },
  confidenceLow: {
    color: '#f44336',
    fontWeight: 700,
  },
  resultCard: {
    background: "linear-gradient(135deg, rgba(232,245,232,0.98) 0%, rgba(241,248,233,0.98) 50%, rgba(225,245,254,0.98) 100%)",
    backdropFilter: "blur(25px)",
    borderRadius: "24px",
    padding: "40px",
    margin: "24px 0",
    border: "3px solid transparent",
    backgroundImage: 'linear-gradient(135deg, rgba(232,245,232,0.98), rgba(241,248,233,0.98)), linear-gradient(135deg, #4caf50, #8bc34a, #4caf50)',
    backgroundOrigin: 'border-box',
    backgroundClip: 'padding-box, border-box',
    boxShadow: "0 16px 56px rgba(76, 175, 80, 0.3), 0 4px 16px rgba(139, 195, 74, 0.2)",
    position: 'relative',
    animation: 'resultGlow 2s ease-in-out infinite alternate',
  },
  diseaseLabel: {
    fontSize: "22px",
    fontWeight: 800,
    fontFamily: "'Inter', 'Poppins', sans-serif",
    color: "#1b5e20",
    marginBottom: "12px",
    textAlign: "center",
    letterSpacing: "0.5px",
    textTransform: "uppercase",
  },
  diseaseInfoCard: {
    background: "linear-gradient(135deg, rgba(255,255,255,0.99) 0%, rgba(248,251,248,0.99) 100%)",
    borderRadius: "28px",
    padding: "36px",
    marginTop: "32px",
    border: "3px solid rgba(76, 175, 80, 0.2)",
    boxShadow: "0 12px 48px rgba(76, 175, 80, 0.25), 0 2px 8px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,1)",
    animation: "slideInUp 0.6s ease-out",
    position: 'relative',
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: '5px',
      background: 'linear-gradient(90deg, #2e7d32 0%, #4caf50 50%, #66bb6a 100%)',
      borderRadius: '28px 28px 0 0',
    },
  },
  infoSection: {
    marginBottom: "16px",
    padding: "20px 24px",
    background: "linear-gradient(135deg, rgba(248, 251, 248, 0.95) 0%, rgba(240, 248, 245, 0.95) 100%)",
    borderRadius: "16px",
    border: "1.5px solid rgba(76, 175, 80, 0.2)",
    transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
    boxShadow: "0 2px 8px rgba(76, 175, 80, 0.08), inset 0 1px 0 rgba(255,255,255,0.8)",
    '&:hover': {
      background: "linear-gradient(135deg, rgba(248, 251, 248, 1) 0%, rgba(240, 248, 245, 1) 100%)",
      boxShadow: "0 6px 20px rgba(76, 175, 80, 0.15), inset 0 1px 0 rgba(255,255,255,1)",
      transform: "translateY(-2px)",
      borderColor: "rgba(76, 175, 80, 0.35)",
    },
    '&:last-child': {
      marginBottom: 0,
    },
  },
  infoTitle: {
    fontSize: "16px",
    fontWeight: 700,
    fontFamily: "'Inter', 'Poppins', sans-serif",
    color: "#1b5e20",
    textTransform: "uppercase",
    letterSpacing: "1.2px",
    marginBottom: "12px",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    borderBottom: "2.5px solid #4caf50",
    paddingBottom: "10px",
    background: "linear-gradient(90deg, #1b5e20 0%, #2e7d32 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  infoText: {
    fontSize: "15px",
    fontFamily: "'Inter', 'Roboto', sans-serif",
    color: "#263238",
    lineHeight: "1.8",
    letterSpacing: "0.4px",
    fontWeight: 500,
  },
  healthyBadge: {
    background: "linear-gradient(135deg, #4caf50 0%, #66bb6a 100%)",
    color: "white",
    padding: "8px 20px",
    borderRadius: "24px",
    fontSize: "14px",
    fontWeight: 600,
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    marginBottom: "16px",
    boxShadow: "0 4px 12px rgba(76,175,80,0.3)",
  },
  diseasedBadge: {
    background: "linear-gradient(135deg, #f44336 0%, #e57373 100%)",
    color: "white",
    padding: "8px 20px",
    borderRadius: "24px",
    fontSize: "14px",
    fontWeight: 600,
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    marginBottom: "16px",
    boxShadow: "0 4px 12px rgba(244,67,54,0.3)",
  },
  progressBar: {
    width: "100%",
    height: "8px",
    backgroundColor: "#e0e0e0",
    borderRadius: "8px",
    overflow: "hidden",
    marginTop: "12px",
  },
  progressFill: {
    height: "100%",
    borderRadius: "8px",
    transition: "width 0.8s ease-out, background-color 0.3s ease",
  },
  tooltip: {
    position: "relative",
    display: "inline-block",
    cursor: "help",
  },
}));
export const ImageUpload = () => {
  const classes = useStyles();
  const [selectedFile, setSelectedFile] = useState();
  const [preview, setPreview] = useState();
  const [data, setData] = useState();
  const [image, setImage] = useState(false);
  const [isLoading, setIsloading] = useState(false);
  let confidence = 0;

  const sendFile = async () => {
    if (image) {
      let formData = new FormData();
      formData.append("file", selectedFile);
      try {
        let res = await axios({
          method: "post",
          url: process.env.REACT_APP_API_URL || "http://localhost:8000/predict",
          data: formData,
        });
        if (res.status === 200) {
          setData(res.data);
        }
      } catch (error) {
        console.error("Error predicting disease:", error);
        // You could add error state handling here
      }
      setIsloading(false);
    }
  }

  const clearData = () => {
    setData(null);
    setImage(false);
    setSelectedFile(null);
    setPreview(null);
  };

  useEffect(() => {
    if (!selectedFile) {
      setPreview(undefined);
      return;
    }
    const objectUrl = URL.createObjectURL(selectedFile);
    setPreview(objectUrl);
  }, [selectedFile]);

  useEffect(() => {
    if (!preview) {
      return;
    }
    setIsloading(true);
    sendFile();
  }, [preview]);

  const onSelectFile = (files) => {
    if (!files || files.length === 0) {
      setSelectedFile(undefined);
      setImage(false);
      setData(undefined);
      return;
    }
    setSelectedFile(files[0]);
    setData(undefined);
    setImage(true);
  };

  if (data) {
    confidence = (parseFloat(data.confidence) * 100).toFixed(2);
  }

  const getConfidenceClass = () => {
    const conf = parseFloat(confidence);
    if (conf >= 80) return classes.confidenceHigh;
    if (conf >= 60) return classes.confidenceMedium;
    return classes.confidenceLow;
  };

  const formatDiseaseLabel = (label) => {
    return label.replace(/Tomato_/g, '').replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  return (
    <React.Fragment>
      <AppBar position="static" className={classes.appbar}>
        <Toolbar className={classes.toolbar}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div className={classes.logoContainer}>
              <Avatar src="/cblogo.PNG.png" className={classes.logo}></Avatar>
            </div>
            <div>
              <div style={{
                fontSize: '11px',
                fontWeight: 700,
                letterSpacing: '2px',
                color: 'rgba(255,255,255,0.9)',
                marginBottom: '2px'
              }}>
                🌱 TOMO VISION
              </div>
              <Typography className={classes.title} variant="h5" noWrap>
                Tomato Disease Detection
              </Typography>
            </div>
          </div>
          <div className={classes.grow} />
          <Chip
            icon={<AutorenewIcon style={{ animation: 'spin 3s linear infinite' }} />}
            label="AI-Powered"
            style={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0.15) 100%)',
              backdropFilter: 'blur(10px)',
              color: 'white',
              fontWeight: 700,
              fontSize: '13px',
              padding: '6px 14px',
              height: '36px',
              border: '1px solid rgba(255,255,255,0.3)',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              transition: 'all 0.3s ease',
            }}
          />
          <Chip
            label="Ready"
            style={{
              background: 'rgba(139, 195, 74, 0.3)',
              backdropFilter: 'blur(10px)',
              color: 'white',
              fontWeight: 700,
              fontSize: '13px',
              padding: '6px 14px',
              height: '36px',
              marginLeft: '10px',
              border: '1px solid rgba(255,255,255,0.3)',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            }}
          />
        </Toolbar>
      </AppBar>
      <Container maxWidth={false} className={classes.mainContainer} disableGutters={true}>
        {!image && !data && (
          <Fade in={true} timeout={800}>
            <div className={classes.heroBanner}>
              <Typography variant="h3" className={classes.heroTitle}>
                AI-Powered Disease Detection
              </Typography>
              <Typography variant="h6" className={classes.heroSubtitle}>
                Get instant, accurate diagnosis for your tomato plants
              </Typography>
              <Grid container spacing={3} style={{ marginTop: '32px', maxWidth: '900px', margin: '32px auto 0' }}>
                <Grid item xs={12} sm={4}>
                  <div className={classes.featureCard}>
                    <div className={classes.featureIcon}>🎯</div>
                    <Typography className={classes.featureTitle}>High Accuracy</Typography>
                    <Typography className={classes.featureText}>95%+ detection rate</Typography>
                  </div>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <div className={classes.featureCard}>
                    <div className={classes.featureIcon}>⚡</div>
                    <Typography className={classes.featureTitle}>Instant Results</Typography>
                    <Typography className={classes.featureText}>Analysis in seconds</Typography>
                  </div>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <div className={classes.featureCard}>
                    <div className={classes.featureIcon}>🌱</div>
                    <Typography className={classes.featureTitle}>Expert Care Tips</Typography>
                    <Typography className={classes.featureText}>Treatment guidance</Typography>
                  </div>
                </Grid>
              </Grid>
            </div>
          </Fade>
        )}
        <Grid
          className={classes.gridContainer}
          container
          direction="row"
          justifyContent="center"
          alignItems="center"
          spacing={3}
        >
          <Grid item xs={12} md={8} lg={6}>
            {!image && <Fade in={true} timeout={600}>
              <Paper className={classes.diseasesCard}>
                <Typography variant="h6" className={classes.diseasesTitle}>
                  🔬 Detectable Conditions
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography className={classes.diseaseItem}>• Tomato Bacterial Spot</Typography>
                    <Typography className={classes.diseaseItem}>• Tomato Early Blight</Typography>
                    <Typography className={classes.diseaseItem}>• Tomato Late Blight</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography className={classes.diseaseItem}>• Tomato Leaf Mold</Typography>
                    <Typography className={classes.diseaseItem}>• Tomato Target Spot</Typography>
                    <Typography className={classes.diseaseItem}>• Healthy Tomato</Typography>
                  </Grid>
                </Grid>
              </Paper>
            </Fade>}
            <Zoom in={true} timeout={500}>
              <Card className={`${classes.imageCard} ${!image ? classes.imageCardEmpty : ''}`}>
                {image && <Fade in={true} timeout={800}>
                  <CardActionArea>
                    <CardMedia
                      className={classes.media}
                      image={preview}
                      component="image"
                      title="Uploaded Tomato Leaf"
                    />
                  </CardActionArea>
                </Fade>
                }
                {!image && <CardContent className={classes.dropzoneContainer}>
                  <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                    <div style={{ fontSize: '48px', marginBottom: '16px' }}>📸</div>
                    <Typography variant="h6" style={{
                      color: '#2e7d32',
                      fontWeight: 700,
                      marginBottom: '8px'
                    }}>
                      Upload Leaf Image
                    </Typography>
                    <Typography variant="body2" style={{
                      color: '#546e7a',
                      fontSize: '14px',
                      maxWidth: '380px',
                      margin: '0 auto'
                    }}>
                      Drag and drop or click to select a clear image of a tomato leaf
                    </Typography>
                  </div>
                  <DropzoneArea
                    acceptedFiles={['image/*']}
                    dropzoneText={""}
                    onChange={onSelectFile}
                    maxFileSize={5000000}
                    showFileNames={true}
                    showAlerts={true}
                    filesLimit={1}
                    dropzoneClass={classes.customDropzone}
                  />
                  <div style={{
                    marginTop: '28px',
                    padding: '16px 24px',
                    background: 'linear-gradient(135deg, rgba(76, 175, 80, 0.08), rgba(139, 195, 74, 0.08))',
                    borderRadius: '12px',
                    border: '1px solid rgba(76, 175, 80, 0.2)'
                  }}>
                    <Typography variant="body2" style={{
                      color: '#2e7d32',
                      fontSize: '13px',
                      fontWeight: 600,
                      marginBottom: '8px'
                    }}>
                      💡 Pro Tips for Best Results:
                    </Typography>
                    <Typography variant="body2" style={{
                      color: '#546e7a',
                      fontSize: '12px',
                      lineHeight: 1.8
                    }}>
                      • Use good natural or artificial lighting<br />
                      • Focus on a single leaf for clarity<br />
                      • Capture both sides if symptoms vary<br />
                      • Avoid blurry or out-of-focus images
                    </Typography>
                  </div>
                </CardContent>}
                {isLoading && !data && image && <CardContent className={classes.detail}>
                  <div className={classes.loadingContainer}>
                    <CircularProgress size={80} thickness={4} style={{ color: '#4caf50' }} />
                    <Typography className={classes.loadingTitle}>
                      Analyzing Leaf Image...
                    </Typography>
                    <Typography className={classes.loadingSubtitle}>
                      Our AI model is examining the leaf for diseases
                    </Typography>
                    <div className={classes.loadingSteps}>
                      <div className={classes.loadingStep}>
                        <div className={classes.loadingStepIcon}>✓</div>
                        <Typography className={classes.loadingStepText}>Image uploaded</Typography>
                      </div>
                      <div className={classes.loadingStep}>
                        <div className={classes.loadingStepIcon}>⏳</div>
                        <Typography className={classes.loadingStepText}>Processing features</Typography>
                      </div>
                      <div className={classes.loadingStep}>
                        <div className={classes.loadingStepIconPending}>•</div>
                        <Typography className={classes.loadingStepTextPending}>Generating report</Typography>
                      </div>
                    </div>
                  </div>
                </CardContent>}
                {data && <CardContent className={classes.detail}>
                  <div className={classes.resultCard}>
                    <div className={data.class === "Tomato_healthy" ? classes.healthyBadge : classes.diseasedBadge}>
                      {data.class === "Tomato_healthy" ? "✓ Healthy Plant" : "⚠ Disease Detected"}
                    </div>
                    <Typography className={classes.diseaseLabel}>
                      {formatDiseaseLabel(data.class)}
                    </Typography>
                    <TableContainer component={Paper} className={classes.tableContainer}>
                      <Table className={classes.table} size="small" aria-label="prediction results">
                        <TableHead className={classes.tableHead}>
                          <TableRow className={classes.tableRow}>
                            <TableCell className={classes.tableCell1}>Classification</TableCell>
                            <TableCell align="right" className={classes.tableCell1}>Confidence</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody className={classes.tableBody}>
                          <TableRow className={classes.tableRow}>
                            <TableCell component="th" scope="row" className={classes.tableCell}>
                              {formatDiseaseLabel(data.class)}
                            </TableCell>
                            <TableCell align="right" className={`${classes.tableCell} ${getConfidenceClass()}`}>
                              {confidence}%
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </TableContainer>
                    <div className={classes.progressBar}>
                      <div
                        className={classes.progressFill}
                        style={{
                          width: `${confidence}%`,
                          backgroundColor: parseFloat(confidence) >= 80 ? '#4caf50' :
                            parseFloat(confidence) >= 60 ? '#ff9800' : '#f44336'
                        }}
                      />
                    </div>
                  </div>

                  {diseaseInfo[data.class] && (
                    <div className={classes.diseaseInfoCard}>
                      <Grid container spacing={2}>
                        <Grid item xs={12}>
                          <div className={classes.infoSection}>
                            <Typography className={classes.infoTitle}>
                              📋 Description
                            </Typography>
                            <Typography className={classes.infoText}>
                              {diseaseInfo[data.class].description}
                            </Typography>
                          </div>
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <div className={classes.infoSection}>
                            <Typography className={classes.infoTitle}>
                              🔍 Key Symptoms
                            </Typography>
                            <Typography className={classes.infoText}>
                              {diseaseInfo[data.class].symptoms}
                            </Typography>
                          </div>
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <div className={classes.infoSection}>
                            <Typography className={classes.infoTitle}>
                              💊 Treatment Plan
                            </Typography>
                            <Typography className={classes.infoText}>
                              {diseaseInfo[data.class].treatment}
                            </Typography>
                          </div>
                        </Grid>
                      </Grid>
                    </div>
                  )}

                  {/* Action Button inside card */}
                  <div style={{ marginTop: '24px', padding: '0 16px 16px' }}>
                    <ColorButton
                      variant="contained"
                      className={classes.analyzeButton}
                      color="primary"
                      component="span"
                      size="large"
                      onClick={clearData}
                      startIcon={<RefreshIcon style={{ fontSize: '24px' }} />}
                      fullWidth
                    >
                      Analyze Another Leaf
                    </ColorButton>
                  </div>
                </CardContent>}
                {isLoading && <CardContent className={classes.detail}>
                  <CircularProgress size={60} className={classes.loader} />
                  <Typography className={classes.loadingText} variant="h6" noWrap>
                    🔬 Analyzing leaf image...
                  </Typography>
                  <Typography variant="body2" style={{ color: '#9e9e9e', marginTop: '8px' }}>
                    Please wait while our AI processes your image
                  </Typography>
                  <div style={{
                    marginTop: '20px',
                    display: 'flex',
                    gap: '16px',
                    justifyContent: 'center',
                    flexWrap: 'wrap'
                  }}>
                    <Chip label="🧠 Deep Learning" size="small" style={{ backgroundColor: '#e3f2fd' }} />
                    <Chip label="🔍 Pattern Recognition" size="small" style={{ backgroundColor: '#f3e5f5' }} />
                    <Chip label="✨ High Accuracy" size="small" style={{ backgroundColor: '#e8f5e9' }} />
                  </div>
                </CardContent>}
              </Card>
            </Zoom>
          </Grid>
        </Grid>

        {/* Info Guide Section - shown when no image is uploaded */}
        {!image && !data && (
          <Container maxWidth="lg" style={{ position: 'relative', zIndex: 1 }}>
            <InfoGuide />
          </Container>
        )}
      </Container>
      <Footer />
    </React.Fragment>
  );
};
