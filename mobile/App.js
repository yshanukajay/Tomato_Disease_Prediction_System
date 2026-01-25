import React, { useState, useEffect, useMemo } from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, ActivityIndicator, Platform, ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import { StatusBar } from 'expo-status-bar';
import Constants from 'expo-constants';

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
    "Tomato__Target_Spot": {
        description: "Fungal disease causing concentric ring patterns on leaves and fruit.",
        symptoms: "Brown spots with concentric rings, defoliation",
        treatment: "Apply fungicides, remove infected debris, practice crop rotation"
    },
    "Tomato_healthy": {
        description: "Your tomato plant appears healthy with no signs of disease!",
        symptoms: "Green, vigorous foliage with no discoloration or damage",
        treatment: "Continue regular care: water consistently, fertilize, monitor for pests"
    }
};

export default function App() {
    const [image, setImage] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);
    const apiUrl = useMemo(() => Constants.expoConfig?.extra?.apiUrl || 'http://localhost:8000/predict', []);

    const pickImage = async (fromCamera) => {
        setError(null);
        setResult(null);
        const permission = fromCamera
            ? await ImagePicker.requestCameraPermissionsAsync()
            : await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (!permission.granted) {
            setError('Permission is required to access images.');
            return;
        }

        const picker = fromCamera
            ? ImagePicker.launchCameraAsync
            : ImagePicker.launchImageLibraryAsync;

        const response = await picker({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 0.8,
            base64: false,
        });

        if (response.canceled) return;
        const asset = response.assets[0];
        setImage(asset);
    };

    useEffect(() => {
        const send = async () => {
            if (!image) return;
            setUploading(true);
            setError(null);
            setResult(null);
            try {
                const formData = new FormData();
                formData.append('file', {
                    uri: image.uri,
                    name: 'leaf.jpg',
                    type: 'image/jpeg',
                });

                const res = await axios.post(apiUrl, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                    timeout: 15000,
                });
                setResult(res.data);
            } catch (err) {
                setError('Prediction failed. Check network/API URL.');
                console.error(err);
            } finally {
                setUploading(false);
            }
        };
        send();
    }, [image]);

    const formatLabel = (label) => label?.replace(/Tomato_/g, '').replace(/_/g, ' ');
    const info = result ? diseaseInfo[result.class] : null;

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
            <StatusBar style="light" />

            <View style={styles.hero}>
                <View style={styles.brandRow}>
                    <Image source={require('./assets/cblogo.png')} style={styles.logo} />
                    <View>
                        <Text style={styles.kicker}>Agri Vision</Text>
                        <Text style={styles.title}>Tomato Disease Detector</Text>
                    </View>
                </View>
                <Text style={styles.subtitle}>Snap or upload a leaf to get instant diagnosis and care tips.</Text>
                <View style={styles.statusRow}>
                    <View style={[styles.pill, styles.pillSuccess]}>
                        <View style={styles.dot} />
                        <Text style={styles.pillText}>Model Ready</Text>
                    </View>
                    <View style={[styles.pill, styles.pillMuted]}>
                        <Text style={styles.pillTextSmall}>{apiUrl}</Text>
                    </View>
                </View>
            </View>

            <View style={styles.buttonRow}>
                <TouchableOpacity style={styles.buttonPrimary} onPress={() => pickImage(true)}>
                    <Text style={styles.buttonText}>Use Camera</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.buttonGhost} onPress={() => pickImage(false)}>
                    <Text style={styles.buttonText}>Pick from Gallery</Text>
                </TouchableOpacity>
            </View>

            {image && (
                <View style={styles.previewCard}>
                    <Text style={styles.sectionLabel}>Selected Leaf</Text>
                    <Image source={{ uri: image.uri }} style={styles.preview} resizeMode="cover" />
                </View>
            )}

            {uploading && (
                <View style={styles.card}>
                    <ActivityIndicator size="large" color="#4caf50" />
                    <Text style={styles.info}>Analyzing leaf image...</Text>
                </View>
            )}

            {result && (
                <View>
                    <View style={styles.card}>
                        <Text style={styles.sectionLabel}>Prediction</Text>
                        <Text style={styles.value}>{formatLabel(result.class)}</Text>
                        <Text style={styles.label}>Confidence</Text>
                        <Text style={styles.value}>{Math.round((result.confidence || 0) * 100)}%</Text>
                    </View>

                    {info && (
                        <View style={styles.infoCard}>
                            <Text style={styles.infoTitle}>📋 Description</Text>
                            <Text style={styles.infoText}>{info.description}</Text>

                            <Text style={styles.infoTitle}>🔍 Symptoms</Text>
                            <Text style={styles.infoText}>{info.symptoms}</Text>

                            <Text style={styles.infoTitle}>💊 Treatment</Text>
                            <Text style={styles.infoText}>{info.treatment}</Text>
                        </View>
                    )}

                    <TouchableOpacity
                        style={styles.resetButton}
                        onPress={() => { setImage(null); setResult(null); setError(null); }}
                    >
                        <Text style={styles.buttonText}>Analyze Another Leaf</Text>
                    </TouchableOpacity>
                </View>
            )}

            {error && (
                <View style={[styles.card, styles.errorCard]}>
                    <Text style={styles.errorText}>{error}</Text>
                </View>
            )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0f1f10',
    },
    contentContainer: {
        paddingTop: Platform.select({ ios: 60, android: 40, default: 32 }),
        paddingHorizontal: 20,
        paddingBottom: 30,
    },
    hero: {
        backgroundColor: '#132415',
        borderRadius: 18,
        padding: 18,
        borderWidth: 1,
        borderColor: '#234025',
        marginBottom: 16,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowOffset: { width: 0, height: 6 },
        shadowRadius: 12,
    },
    brandRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    logo: {
        width: 56,
        height: 56,
        borderRadius: 12,
        marginRight: 12,
    },
    kicker: {
        color: '#8bc34a',
        fontSize: 12,
        letterSpacing: 1,
        textTransform: 'uppercase',
    },
    title: {
        fontSize: 26,
        fontWeight: '800',
        color: '#ffffff',
        marginTop: 2,
    },
    subtitle: {
        fontSize: 14,
        color: '#cfd8dc',
        marginBottom: 14,
        lineHeight: 20,
    },
    statusRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    pill: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 8,
        borderRadius: 999,
        marginRight: 8,
        marginBottom: 8,
    },
    pillSuccess: {
        backgroundColor: 'rgba(98, 197, 84, 0.14)',
        borderColor: '#62c554',
        borderWidth: 1,
    },
    pillMuted: {
        backgroundColor: '#0f1f10',
        borderColor: '#234025',
        borderWidth: 1,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#62c554',
        marginRight: 6,
    },
    pillText: {
        color: '#e8f5e9',
        fontWeight: '700',
        fontSize: 13,
    },
    pillTextSmall: {
        color: '#a3b7a6',
        fontWeight: '600',
        fontSize: 11,
    },
    buttonRow: {
        flexDirection: 'row',
        marginBottom: 14,
    },
    buttonPrimary: {
        flex: 1,
        backgroundColor: '#62c554',
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: 'center',
        shadowColor: '#62c554',
        shadowOpacity: 0.35,
        shadowOffset: { width: 0, height: 8 },
        shadowRadius: 18,
        marginRight: 8,
    },
    buttonGhost: {
        flex: 1,
        borderColor: '#62c554',
        borderWidth: 2,
        paddingVertical: 12,
        borderRadius: 12,
        alignItems: 'center',
        backgroundColor: 'rgba(98, 197, 84, 0.08)',
    },
    buttonText: {
        color: '#fff',
        fontWeight: '700',
        fontSize: 15,
    },
    previewCard: {
        backgroundColor: '#122816',
        borderRadius: 16,
        padding: 14,
        borderWidth: 1,
        borderColor: '#234025',
        marginBottom: 12,
    },
    preview: {
        width: '100%',
        height: 240,
        borderRadius: 12,
    },
    sectionLabel: {
        color: '#8bc34a',
        fontSize: 12,
        fontWeight: '700',
        letterSpacing: 0.4,
        marginBottom: 8,
    },
    card: {
        width: '100%',
        backgroundColor: '#132415',
        borderRadius: 16,
        padding: 16,
        marginTop: 10,
        borderWidth: 1,
        borderColor: '#234025',
    },
    label: {
        color: '#9e9e9e',
        fontSize: 12,
        marginTop: 10,
    },
    value: {
        color: '#ffffff',
        fontSize: 20,
        fontWeight: '800',
        marginTop: 6,
    },
    info: {
        color: '#cfd8dc',
        marginTop: 8,
    },
    infoCard: {
        backgroundColor: '#132415',
        borderRadius: 16,
        padding: 20,
        marginTop: 16,
        borderWidth: 1,
        borderColor: '#234025',
    },
    infoTitle: {
        color: '#62c554',
        fontSize: 16,
        fontWeight: '800',
        marginTop: 12,
        marginBottom: 6,
    },
    infoText: {
        color: '#cfd8dc',
        fontSize: 14,
        lineHeight: 20,
    },
    resetButton: {
        backgroundColor: '#62c554',
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 16,
    },
    errorCard: {
        borderColor: '#f44336',
        backgroundColor: '#281311',
    },
    errorText: {
        color: '#ff9e9e',
        fontWeight: '600',
    },
});
