import { ModalStudentStatus } from "./ModalStudentStatus";
import { View, Text, Image, Alert, Modal, Pressable } from "react-native";
import React, { useEffect, useState, useCallback } from "react";
import image from "@/constants/image";
import {
  Camera,
  useCameraDevice,
  CameraPermissionStatus,
  useCodeScanner,
} from "react-native-vision-camera";
import Button from "@/components/Button";

const SecurityUI = () => {
  const [cameraPermission, setCameraPermission] =
    useState<CameraPermissionStatus | null>(null);
  const [microphonePermission, setMicrophonePermission] =
    useState<CameraPermissionStatus | null>(null);
  const device = useCameraDevice("back");

  const [isScanned, setIsScanned] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [scannedID, setScannedID] = useState<string | null>(null);

  const showPermissionsPage =
    cameraPermission !== "granted" || microphonePermission !== "granted";

  // Handle code scan
  const handleCodeScanned = useCallback(
    (codes: any[]) => {
      if (!isScanned && codes.length > 0) {
        const data = codes[0]?.value || "No data";
        setIsScanned(true);
        setScannedID(data);
        setModalVisible(true);
      }
    },
    [isScanned]
  );

  const codeScanner = useCodeScanner({
    codeTypes: ["qr"],
    onCodeScanned: handleCodeScanned,
  });

  const requestPermissions = async () => {
    const camStatus = await Camera.requestCameraPermission();
    const micStatus = await Camera.requestMicrophonePermission();
    setCameraPermission(camStatus);
    setMicrophonePermission(micStatus);

    if (camStatus !== "granted" || micStatus !== "granted") {
      Alert.alert(
        "Permission Denied",
        "Camera and Microphone access are required."
      );
    }
  };

  useEffect(() => {
    requestPermissions();
  }, []);

  return (
    <View className="flex-1 mx-6">
      {/* Header */}
      <View className="flex-row py-2 w-full justify-between items-center border-b-2 border-white">
        <Text className="text-2xl text-white font-medium">SECURITY</Text>
        <Image
          source={image.prmsu}
          className="w-14 h-14"
          resizeMode="contain"
        />
      </View>

      <View className="flex-1 my-6 justify-center items-center gap-8 rounded">
        {!showPermissionsPage ? (
          <View className="w-full h-full bg-uBlack rounded-lg overflow-hidden items-center justify-center border-2 border-black">
            {device ? (
              <Camera
                style={{ width: "100%", height: "100%" }}
                device={device}
                isActive={!isScanned}
                codeScanner={codeScanner}
                resizeMode="cover"
              />
            ) : (
              <Text className="font-semibold text-xl text-primary">
                !!! No Camera Detected !!!
              </Text>
            )}
          </View>
        ) : (
          <View className="w-full h-full rounded-lg overflow-hidden items-center justify-center">
            <Text className="text-xl text-uBlack mb-4 font-semibold text-center">
              Camera permissions are required.
            </Text>
            <Button
              title="Request Permission"
              handlePress={requestPermissions}
              containerStyles="h-12"
            />
          </View>
        )}
      </View>
      <View className="w-full mb-8">
        <Text className="text-xl text-uBlack font-semibold">
          Update Student's Status
        </Text>
        <View className="flex-row gap-2">
          <Text className="text-base text-uBlack">1.</Text>
          <Text className="text-base text-uBlack flex-shrink">
            Ensure the app has camera permissions enabled in your device
            settings.
          </Text>
        </View>
        <View className="flex-row gap-2">
          <Text className="text-base text-uBlack">2.</Text>
          <Text className="text-base text-uBlack flex-shrink">
            Point the camera at the student's QR Code for the modal to show.
          </Text>
        </View>
        <View className="flex-row gap-2">
          <Text className="text-base text-uBlack">3.</Text>
          <Text className="text-base text-uBlack flex-shrink">
            Verify student's identity and update its status.
          </Text>
        </View>
      </View>
      {isScanned && (
        <ModalStudentStatus setIsScanned={setIsScanned} scannedID={scannedID} />
      )}
    </View>
  );
};

export default SecurityUI;
