import { View, Text, Image, FlatList } from "react-native";
import React, { useEffect, useState, useCallback } from "react";
import image from "@/constants/image";
import { useGlobalContext } from "@/context/GlobalProvider";
import { getLogListItem } from "@/services/log";
import Toast from "react-native-toast-message";
import { ILogItem } from "@/services/types/interface";
import LogItem from "@/components/LogItem";
import color from "@/constants/color";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const emptyLog = () => {
  return (
    <View className="flex-1 bg-white rounded-xl py-16 mt-10 items-center gap-2">
      <MaterialCommunityIcons
        name="timer-sand-empty"
        size={64}
        color={color.uGray}
      />

      <Text className="text-xl font-semibold text-uGray">
        No Student Log as of today.
      </Text>
    </View>
  );
};

const AdminUI = () => {
  const { userInfo } = useGlobalContext();
  const [isLoading, setIsLoading] = useState(false);
  const [logListItem, setLogListItem] = useState<ILogItem[]>([]);

  const queryLogList = useCallback(async () => {
    try {
      setIsLoading(true);
      const result = await getLogListItem(
        userInfo.admin_info?.department!,
        new Date()
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
  }, [userInfo.admin_info?.department]);

  useEffect(() => {
    queryLogList();
  }, [queryLogList]);

  if (!userInfo.admin_info) return null;

  return (
    <View className="flex-1 mx-6">
      {/* Header */}
      <View className="flex-row py-4 w-full justify-between items-center border-b-2 border-white">
        <View>
          <Text className="text-2xl text-white">
            {userInfo.admin_info.department} LOG
          </Text>
          <Text className="text-sm text-white -mt-1">
            {new Date().toLocaleDateString("en-US", {
              month: "short",
              day: "2-digit",
              year: "numeric",
              weekday: "short",
            })}
          </Text>
        </View>
        <Image
          source={image.prmsu}
          className="w-14 h-14"
          resizeMode="contain"
        />
      </View>

      {/* Refreshable FlatList */}
      <FlatList
        data={logListItem}
        renderItem={({ item }) => <LogItem key={item.id} item={item} />}
        className="py-2"
        keyExtractor={(item) => item.id}
        refreshing={isLoading}
        onRefresh={queryLogList}
        contentContainerStyle={{ paddingBottom: 24 }}
        ListEmptyComponent={emptyLog}
      />
      {/* <View className="w-full py-3 border-t">
        <Text className="text-sm text-uBlack -mt-1">
          {new Date().toLocaleDateString("en-US", {
            month: "short",
            day: "2-digit",
            year: "numeric",
            weekday: "short",
          })}
        </Text>
      </View> */}
    </View>
  );
};

export default AdminUI;
