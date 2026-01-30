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
                    <View style={styles.logoWrapper}>
                        <Image source={require('./assets/cblogo.png')} style={styles.logo} />
                    </View>
                    <View style={styles.brandTextContainer}>
                        <Text style={styles.kicker}>🌱 TOMO VISION</Text>
                        <Text style={styles.title}>Tomato Disease{"\n"}Detector</Text>
                    </View>
                </View>
                <View style={styles.divider} />
                <Text style={styles.subtitle}>📸 Snap or upload a tomato leaf to receive instant AI-powered diagnosis and expert care recommendations.</Text>
                <View style={styles.statusRow}>
                    <View style={[styles.pill, styles.pillSuccess]}>
                        <View style={styles.dot} />
                        <Text style={styles.pillText}>AI Model Active</Text>
                    </View>
                    <View style={[styles.pill, styles.pillInfo]}>
                        <Text style={styles.pillText}>✓ Ready</Text>
                    </View>
                </View>
            </View>

            <View style={styles.diseasesCard}>
                <Text style={styles.diseasesTitle}>🔬 Detectable Conditions</Text>
                <Text style={styles.diseasesSubtitle}>Our AI can identify the following:</Text>
                <View style={styles.diseasesList}>
                    <View style={styles.diseaseRow}>
                        <View style={styles.diseaseBullet} />
                        <Text style={styles.diseaseItem}>Tomato Bacterial Spot</Text>
                    </View>
                    <View style={styles.diseaseRow}>
                        <View style={styles.diseaseBullet} />
                        <Text style={styles.diseaseItem}>Tomato Early Blight</Text>
                    </View>
                    <View style={styles.diseaseRow}>
                        <View style={styles.diseaseBullet} />
                        <Text style={styles.diseaseItem}>Tomato Late Blight</Text>
                    </View>
                    <View style={styles.diseaseRow}>
                        <View style={styles.diseaseBullet} />
                        <Text style={styles.diseaseItem}>Tomato Leaf Mold</Text>
                    </View>
                    <View style={styles.diseaseRow}>
                        <View style={styles.diseaseBullet} />
                        <Text style={styles.diseaseItem}>Tomato Target Spot</Text>
                    </View>
                    <View style={styles.diseaseRow}>
                        <View style={[styles.diseaseBullet, styles.healthyBullet]} />
                        <Text style={[styles.diseaseItem, styles.healthyItem]}>Healthy Tomato ✓</Text>
                    </View>
                </View>
            </View>

            <View style={styles.buttonRow}>
                <TouchableOpacity style={styles.buttonPrimary} onPress={() => pickImage(true)} activeOpacity={0.8}>
                    <Text style={styles.buttonIcon}>📷</Text>
                    <Text style={styles.buttonText}>Camera</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.buttonGhost} onPress={() => pickImage(false)} activeOpacity={0.8}>
                    <Text style={styles.buttonIcon}>🖼️</Text>
                    <Text style={styles.buttonText}>Gallery</Text>
                </TouchableOpacity>
            </View>

            {image && (
                <View style={styles.previewCard}>
                    <Text style={styles.sectionLabel}>Selected Leaf</Text>
                    <Image source={{ uri: image.uri }} style={styles.preview} resizeMode="cover" />
                </View>
            )}

            {uploading && (
                <View style={styles.loadingCard}>
                    <ActivityIndicator size="large" color="#62c554" />
                    <Text style={styles.loadingTitle}>Analyzing Leaf...</Text>
                    <Text style={styles.loadingSubtitle}>AI model processing your image</Text>
                </View>
            )}

            {result && (
                <View>
                    <View style={styles.resultCard}>
                        <View style={styles.resultBadge}>
                            <Text style={styles.resultBadgeText}>{result.class === "Tomato_healthy" ? "✓" : "⚠"}</Text>
                        </View>
                        <Text style={styles.sectionLabel}>DIAGNOSIS</Text>
                        <Text style={styles.value}>{formatLabel(result.class)}</Text>
                        <View style={styles.confidenceContainer}>
                            <View style={styles.confidenceBarBg}>
                                <View style={[styles.confidenceBar, { width: `${Math.round((result.confidence || 0) * 100)}%` }]} />
                            </View>
                            <Text style={styles.confidenceText}>{Math.round((result.confidence || 0) * 100)}% Confidence</Text>
                        </View>
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
        backgroundColor: '#1a1a2e',
    },
    contentContainer: {
        paddingTop: Platform.select({ ios: 60, android: 40, default: 32 }),
        paddingHorizontal: 20,
        paddingBottom: 30,
    },
    hero: {
        backgroundColor: '#16213e',
        borderRadius: 20,
        padding: 24,
        borderWidth: 2,
        borderColor: '#0f3460',
        marginBottom: 20,
        shadowColor: '#000',
        shadowOpacity: 0.4,
        shadowOffset: { width: 0, height: 8 },
        shadowRadius: 16,
        elevation: 8,
    },
    brandRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    logoWrapper: {
        width: 68,
        height: 68,
        borderRadius: 16,
        backgroundColor: '#ffffff',
        padding: 6,
        shadowColor: '#62c554',
        shadowOpacity: 0.3,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 12,
        elevation: 6,
        marginRight: 14,
    },
    logo: {
        width: '100%',
        height: '100%',
        borderRadius: 12,
    },
    brandTextContainer: {
        flex: 1,
    },
    kicker: {
        color: '#8bc34a',
        fontSize: 11,
        letterSpacing: 1.5,
        fontWeight: '700',
        marginBottom: 4,
    },
    title: {
        fontSize: 22,
        fontWeight: '800',
        color: '#ffffff',
        lineHeight: 26,
    },
    divider: {
        height: 1,
        backgroundColor: '#2d4a30',
        marginVertical: 14,
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
        backgroundColor: 'rgba(98, 197, 84, 0.2)',
        borderColor: '#62c554',
        borderWidth: 1.5,
    },
    pillInfo: {
        backgroundColor: 'rgba(139, 195, 74, 0.2)',
        borderColor: '#8bc34a',
        borderWidth: 1.5,
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
    diseasesCard: {
        backgroundColor: '#1a2e1c',
        borderRadius: 18,
        padding: 20,
        marginBottom: 18,
        borderWidth: 2,
        borderColor: '#2d4a30',
        shadowColor: '#000',
        shadowOpacity: 0.3,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 8,
        elevation: 5,
    },
    diseasesTitle: {
        color: '#62c554',
        fontSize: 17,
        fontWeight: '800',
        marginBottom: 6,
    },
    diseasesSubtitle: {
        color: '#a3b7a6',
        fontSize: 13,
        marginBottom: 14,
        fontWeight: '500',
    },
    diseasesList: {
        gap: 10,
    },
    diseaseRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    diseaseBullet: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#62c554',
        marginRight: 10,
    },
    healthyBullet: {
        backgroundColor: '#8bc34a',
    },
    diseaseItem: {
        color: '#cfd8dc',
        fontSize: 14,
        fontWeight: '500',
    },
    healthyItem: {
        color: '#8bc34a',
        fontWeight: '700',
    },
    buttonRow: {
        flexDirection: 'row',
        marginBottom: 16,
        gap: 12,
    },
    buttonPrimary: {
        flex: 1,
        backgroundColor: '#62c554',
        paddingVertical: 16,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        shadowColor: '#62c554',
        shadowOpacity: 0.5,
        shadowOffset: { width: 0, height: 6 },
        shadowRadius: 20,
        elevation: 8,
    },
    buttonGhost: {
        flex: 1,
        borderColor: '#62c554',
        borderWidth: 2.5,
        paddingVertical: 14,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        backgroundColor: 'rgba(98, 197, 84, 0.12)',
    },
    buttonIcon: {
        fontSize: 18,
        marginRight: 8,
    },
    buttonText: {
        color: '#fff',
        fontWeight: '800',
        fontSize: 15,
    },
    previewCard: {
        backgroundColor: '#1a2e1c',
        borderRadius: 18,
        padding: 16,
        borderWidth: 2,
        borderColor: '#2d4a30',
        marginBottom: 16,
        shadowColor: '#000',
        shadowOpacity: 0.3,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 10,
        elevation: 6,
    },
    loadingCard: {
        backgroundColor: '#1a2e1c',
        borderRadius: 18,
        padding: 28,
        marginTop: 10,
        borderWidth: 2,
        borderColor: '#2d4a30',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.3,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 10,
        elevation: 6,
    },
    loadingTitle: {
        color: '#ffffff',
        fontSize: 18,
        fontWeight: '700',
        marginTop: 16,
    },
    loadingSubtitle: {
        color: '#a3b7a6',
        fontSize: 13,
        marginTop: 6,
    },
    resultCard: {
        backgroundColor: '#1a2e1c',
        borderRadius: 18,
        padding: 20,
        marginTop: 10,
        borderWidth: 2,
        borderColor: '#2d4a30',
        shadowColor: '#000',
        shadowOpacity: 0.3,
        shadowOffset: { width: 0, height: 6 },
        shadowRadius: 12,
        elevation: 8,
        position: 'relative',
    },
    resultBadge: {
        position: 'absolute',
        top: -12,
        right: 20,
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#62c554',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#62c554',
        shadowOpacity: 0.5,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 8,
        elevation: 6,
    },
    resultBadgeText: {
        fontSize: 20,
    },
    confidenceContainer: {
        marginTop: 16,
    },
    confidenceBarBg: {
        height: 8,
        backgroundColor: '#0f1f10',
        borderRadius: 4,
        overflow: 'hidden',
        marginBottom: 8,
    },
    confidenceBar: {
        height: '100%',
        backgroundColor: '#62c554',
        borderRadius: 4,
    },
    confidenceText: {
        color: '#a3b7a6',
        fontSize: 13,
        fontWeight: '700',
        textAlign: 'center',
    },
    preview: {
        width: '100%',
        height: 240,
        borderRadius: 12,
    },
    sectionLabel: {
        color: '#8bc34a',
        fontSize: 11,
        fontWeight: '800',
        letterSpacing: 1.2,
        marginBottom: 10,
    },
    card: {
        width: '100%',
        backgroundColor: '#1a2e1c',
        borderRadius: 18,
        padding: 20,
        marginTop: 10,
        borderWidth: 2,
        borderColor: '#2d4a30',
        shadowColor: '#000',
        shadowOpacity: 0.3,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 10,
        elevation: 6,
    },
    label: {
        color: '#a3b7a6',
        fontSize: 12,
        marginTop: 12,
        fontWeight: '600',
    },
    value: {
        color: '#ffffff',
        fontSize: 24,
        fontWeight: '800',
        marginTop: 6,
    },
    info: {
        color: '#cfd8dc',
        marginTop: 12,
        fontSize: 14,
    },
    infoCard: {
        backgroundColor: '#1a2e1c',
        borderRadius: 18,
        padding: 22,
        marginTop: 16,
        borderWidth: 2,
        borderColor: '#2d4a30',
        shadowColor: '#000',
        shadowOpacity: 0.3,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 10,
        elevation: 6,
    },
    infoTitle: {
        color: '#62c554',
        fontSize: 16,
        fontWeight: '800',
        marginTop: 14,
        marginBottom: 8,
    },
    infoText: {
        color: '#cfd8dc',
        fontSize: 14,
        lineHeight: 22,
    },
    resetButton: {
        backgroundColor: '#62c554',
        paddingVertical: 16,
        borderRadius: 14,
        alignItems: 'center',
        marginTop: 18,
        shadowColor: '#62c554',
        shadowOpacity: 0.4,
        shadowOffset: { width: 0, height: 6 },
        shadowRadius: 16,
        elevation: 8,
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
