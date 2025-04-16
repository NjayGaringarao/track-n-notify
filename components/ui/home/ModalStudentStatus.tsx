import Button from "@/components/Button";
import Loading from "@/components/Loading";
import ProfilePicture from "@/components/ProfilePicture";
import color from "@/constants/color";
import { User } from "@/services/types/model";
import { getUserInfo, updateStudentStatus } from "@/services/user";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { Modal, View, Text, Pressable } from "react-native";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";

// isVisible prop is not needed because setIsScanned is enough to control the modal visibility
interface ModalStudentStatusProps {
  setIsScanned: (isScanned: boolean) => void;
  scannedID: string | null;
}

export function ModalStudentStatus({
  setIsScanned,
  scannedID,
}: ModalStudentStatusProps) {
  const [studentData, setStudentData] = useState<User>();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fetchError, setFetchError] = useState<string | undefined>();
  const [time, setTime] = useState<Date>(new Date());
  const [isTimePickerVisible, setIsTimePickerVisible] = useState(false);
  const [isImagePreviewVisible, setIsImagePreviewVisible] = useState(false);

  const closeHandle = () => {
    setIsLoading(true);
    setStudentData(undefined);
    setFetchError(undefined);
    setIsScanned(false);
    setTime(new Date(0));
  };

  const timePickerHandle = (
    event: DateTimePickerEvent,
    selectedDate?: Date
  ) => {
    if (selectedDate) setTime(selectedDate);
    setIsTimePickerVisible(false);
  };

  const fetchStudentData = async (id: string) => {
    try {
      setStudentData(await getUserInfo(id));
    } catch (error) {
      setFetchError(`${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateStatus = async () => {
    try {
      setIsSubmitting(true);
      await updateStudentStatus(
        studentData?.id!,
        !studentData?.student_info?.isInside,
        time,
        studentData?.student_info?.dep_prog!
      );

      closeHandle();
    } catch (error) {
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (scannedID) {
      fetchStudentData(scannedID);
      setTime(new Date());
    }
  }, [scannedID]);

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={true}
      onRequestClose={closeHandle}
    >
      <View className="flex-1 justify-center items-center bg-black/60">
        <View className="bg-background rounded-xl w-11/12 min-h-28 shadow-xl items-center overflow-hidden">
          {studentData && !fetchError ? (
            <View className="px-4 py-8 gap-4">
              <View className="bg-background shadow shadow-black flex-row w-full items-center rounded-lg">
                <ProfilePicture
                  userInfo={studentData}
                  containerStyle="shadow-none w-32 h-32"
                  onPress={() => setIsImagePreviewVisible(true)}
                />
                <View className="flex-1 px-4">
                  <Text
                    className="text-uBlack font-medium text-lg"
                    style={{ lineHeight: 20 }}
                  >
                    {studentData.name[0]} {studentData.name[2]}
                  </Text>
                  <Text className="text-uBlack text-base">
                    {studentData.student_info?.dep_prog} |{" "}
                    {studentData.student_info?.year_level.concat(" YEAR")}
                  </Text>
                </View>
              </View>
              <View className="w-full flex-row">
                {/** Enable the pressable if required */}
                <Pressable
                  onPress={() => setIsTimePickerVisible(true)}
                  className="flex-1 flex-row justify-between border border-primary py-1 rounded-lg"
                  disabled={true}
                >
                  <View className="flex-1 flex-row items-center">
                    <Text className="text-uGray text-lg px-4">LOG TIME </Text>
                    <Text
                      className="text-uBlack text-3xl flex-1 text-center border-l border-primary"
                      style={{
                        fontFamily: "Digital",
                        letterSpacing: 1,
                      }}
                    >
                      {time.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                      })}
                    </Text>
                  </View>
                  {/* <AntDesign name="caretdown" size={18} color={color.uBlack} /> */}
                </Pressable>
              </View>
              {isTimePickerVisible && (
                <DateTimePicker
                  value={time}
                  mode="time"
                  display="default"
                  onChange={timePickerHandle}
                />
              )}

              <View className="flex-row justify-between items-center w-full gap-4">
                <Text className="text-uBlack text-lg">
                  Status:{" "}
                  <Text className="font-semibold">
                    {studentData.student_info?.isInside ? "INSIDE" : "OUTSIDE"}
                  </Text>
                </Text>
                <Button
                  title={
                    studentData.student_info?.isInside ? "Logout" : "Login"
                  }
                  handlePress={handleUpdateStatus}
                  containerStyles="flex-1 bg-uBlack"
                  textStyles={`text-white`}
                  isLoading={
                    !studentData || !studentData.student_info || isLoading
                  }
                />
              </View>
            </View>
          ) : (
            <>
              <View className="flex-row w-full bg-failed rounded-b items-center p-4 gap-2">
                <MaterialIcons name="error" size={24} color={color.white} />
                <Text className="text-white text-2xl font-semibold">
                  Error Fetching {scannedID}
                </Text>
              </View>
              <View className="w-full px-8 my-4 items-end">
                <Text
                  className="w-full text-uBlack text-lg font-semibold"
                  style={{ lineHeight: 20 }}
                >
                  {fetchError
                    ? fetchError
                    : "There was a problem fetching student information."}
                </Text>
                <Button title="Close" handlePress={closeHandle} />
              </View>
            </>
          )}
          {isLoading && (
            <View className="absolute h-full w-full items-center justify-center">
              <View className="absolute h-full w-full bg-black rounded-xl" />
              <View>
                <Loading
                  loadingPrompt="Fetching Student Info"
                  loadingColor={color.primary}
                />
              </View>
            </View>
          )}
          {isSubmitting && (
            <View className="absolute h-full w-full items-center justify-center">
              <View className="absolute h-full w-full bg-black rounded-xl" />
              <View>
                <Loading
                  loadingPrompt="Updating Student Status"
                  loadingColor={color.primary}
                />
              </View>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
}
