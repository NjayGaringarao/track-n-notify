import { View, Text, Image, FlatList, Pressable } from "react-native";
import React, { useEffect, useState, useCallback } from "react";
import image from "@/constants/image";
import { useGlobalContext } from "@/context/GlobalProvider";
import { getLogListItem } from "@/services/log";
import Toast from "react-native-toast-message";
import { ILogItem } from "@/services/types/interface";
import LogItem from "@/components/LogItem";
import color from "@/constants/color";
import {
  AntDesign,
  Ionicons,
  MaterialCommunityIcons,
  Octicons,
} from "@expo/vector-icons";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";

interface IHeaderLog {
  logDate: Date;
  setLogDate: (e: Date) => void;
  isTimePickerVisible: boolean;
  setIsTimePickerVisible: (e: boolean) => void;
}

const HeaderLog = ({
  logDate,
  setLogDate,
  isTimePickerVisible,
  setIsTimePickerVisible,
}: IHeaderLog) => {
  const timePickerHandle = (
    event: DateTimePickerEvent,
    selectedDate?: Date
  ) => {
    if (selectedDate) setLogDate(selectedDate);
    setIsTimePickerVisible(false);
  };

  return (
    <View className="w-full">
      <Pressable
        onPress={() => setIsTimePickerVisible(true)}
        className="flex-1 flex-row justify-between bg-white border-primary items-center py-1 mb-2 rounded-lg"
      >
        <View className="flex-1 flex-row items-center">
          <Text className="text-uGray font-medium text-lg px-4">LOG DATE</Text>
          <Text
            className="text-uBlack text-2xl flex-1 text-center border-l border-uGray"
            style={{
              fontFamily: "Digital",
            }}
          >
            {logDate.toLocaleDateString("en-PH", {
              month: "short",
              day: "2-digit",
              year: "numeric",
              weekday: "short",
            })}
          </Text>
        </View>
        <AntDesign
          name="caretdown"
          size={18}
          color={color.uGray}
          className="mr-3"
        />
      </Pressable>

      {isTimePickerVisible && (
        <DateTimePicker
          value={logDate}
          mode="date"
          display="default"
          onChange={timePickerHandle}
        />
      )}
    </View>
  );
};

const emptyLog = () => {
  return (
    <View className="rounded-xl mt-10 overflow-hidden">
      <View className="absolute w-full h-full bg-white opacity-60"></View>
      <View className="py-16 items-center gap-2">
        <MaterialCommunityIcons
          name="timer-sand-empty"
          size={128}
          color={color.uGray}
        />

        <Text className="text-2xl font-medium text-uGray">Empty Record</Text>
        <Text className="text-xs -mt-2">
          No recorded Student Log as of the selected date.
        </Text>
      </View>
    </View>
  );
};

const AdminUI = () => {
  const { userInfo } = useGlobalContext();
  const [isLoading, setIsLoading] = useState(false);
  const [logListItem, setLogListItem] = useState<ILogItem[]>([]);
  const [logDate, setLogDate] = useState<Date>(new Date());
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);

  const HeaderLog = () => {
    const datePickerHandle = (
      event: DateTimePickerEvent,
      selectedDate?: Date
    ) => {
      if (selectedDate) setLogDate(selectedDate);
      setIsDatePickerVisible(false);
    };

    return (
      <View className="w-full">
        <Pressable
          onPress={() => setIsDatePickerVisible(true)}
          className="flex-1 flex-row justify-between bg-white border-primary items-center py-2 mb-2 rounded-lg"
        >
          <View className="flex-1 flex-row items-center">
            <Text className="text-uGray font-medium text-lg px-4">
              LOG DATE
            </Text>
            <Text
              className="text-uBlack text-2xl flex-1 text-center border-l border-uGray"
              style={{
                fontFamily: "Digital",
              }}
            >
              {logDate.toLocaleDateString("en-US", {
                month: "short",
                day: "2-digit",
                year: "numeric",
                weekday: "short",
              })}
            </Text>
          </View>
          <AntDesign
            name="caretdown"
            size={18}
            color={color.uGray}
            className="mr-3"
          />
        </Pressable>

        {isDatePickerVisible && (
          <DateTimePicker
            value={logDate}
            mode="date"
            display="default"
            onChange={datePickerHandle}
          />
        )}
      </View>
    );
  };

  const fetchLogs = async () => {
    try {
      setIsLoading(true);
      const result = await getLogListItem(
        userInfo.admin_info?.department!,
        logDate
      );
      setLogListItem(result);
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Fetch Failed",
        text2: "There was a problem fetching logs.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const queryLogList = useCallback(async () => {
    fetchLogs();
  }, [fetchLogs]);

  useEffect(() => {
    fetchLogs();
  }, [userInfo.admin_info?.department, logDate]);

  if (!userInfo.admin_info) return null;

  return (
    <View className="flex-1 mx-6">
      {/* Header */}
      <View className="flex-row py-2 w-full justify-between items-center border-b-2 border-white">
        <Text className="text-2xl text-white font-medium">
          {userInfo.admin_info.department} LOG
        </Text>

        <Octicons name="log" size={48} color={color.white} />
      </View>
      {/* Background */}
      <Image
        source={
          userInfo.admin_info.department == "CCIT"
            ? image.ccit
            : userInfo.admin_info.department == "CTE"
            ? image.cte
            : userInfo.admin_info.department == "CBAPA"
            ? image.cbapa
            : image.prmsu
        }
        className="absolute mt-16 w-full h-full opacity-10"
        resizeMode="contain"
      />
      {/* Refreshable FlatList */}
      <FlatList
        data={logListItem}
        renderItem={({ item }) => <LogItem key={item.id} item={item} />}
        className="py-2"
        keyExtractor={(item) => item.id}
        refreshing={isLoading}
        onRefresh={queryLogList}
        ListHeaderComponent={() => <HeaderLog />}
        contentContainerStyle={{ paddingBottom: 24 }}
        ListEmptyComponent={emptyLog}
      />
    </View>
  );
};

export default AdminUI;
