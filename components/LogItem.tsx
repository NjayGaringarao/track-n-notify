import React, { useEffect, useState } from "react";
import { View, Text, Image } from "react-native";
import { format } from "date-fns";
import { ILogItem } from "@/services/types/interface";
import ProfilePicture from "./ProfilePicture";

interface ILogItemType {
  item: ILogItem;
}

const LogItem = ({ item }: ILogItemType) => {
  const [name, setName] = useState<[string, string | undefined, string]>([
    "",
    undefined,
    "",
  ]);
  const [logs, setLogs] = useState<
    { id: string; time: string; type: string }[]
  >([]);

  useEffect(() => {
    setName(item.name);
    setLogs(
      item.logs
        .sort(
          (a, b) =>
            new Date(b.log_time).getTime() - new Date(a.log_time).getTime()
        )
        .map((log) => ({
          id: log.id,
          time: new Date(log.log_time).toLocaleTimeString("en-PH", {
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
            timeZone: "Asia/Manila",
          }),

          type: log.isInside ? "IN" : "OUT",
        }))
    );
  }, [item]);

  return (
    <View className="relative mb-3 rounded-xl overflow-hidden">
      <View className="absolute w-full h-full bg-white opacity-60" />
      <View className="flex-row  items-center gap-2 p-3">
        {/* Avatar */}
        <ProfilePicture
          userInfo={item.user_info}
          containerStyle="h-28 w-28 flex-2"
        />

        {/* Info */}
        <View className="flex-1">
          <Text
            className="text-lg font-bold text-uBlack"
            numberOfLines={1}
            adjustsFontSizeToFit={true}
            style={{ lineHeight: 20 }}
          >
            {name[0]}
          </Text>
          <Text
            className="text-lg font-bold text-uBlack"
            numberOfLines={1}
            style={{ lineHeight: 20 }}
            adjustsFontSizeToFit={true}
          >
            {name[2]}
          </Text>

          <Text className="text-sm text-uGray -mb-1">
            {item.user_info.student_info?.$id}
          </Text>
          <Text className="text-sm text-uGray">{`${item.user_info.student_info?.dep_prog.split(
            "-"
          )[1]!} - ${
            item.user_info.student_info?.year_level == "FIRST"
              ? "1"
              : item.user_info.student_info?.year_level == "SECOND"
              ? "2"
              : item.user_info.student_info?.year_level == "THIRD"
              ? "3"
              : item.user_info.student_info?.year_level == "FOURTH"
              ? "4"
              : "5"
          }`}</Text>
        </View>

        {/* Logs */}
        <View className="flex justify-center gap-1 w-24">
          {logs.map((log) => (
            <View
              key={log.id}
              className="flex-row items-center justify-between border border-gray-300 rounded-md px-2 py-1"
            >
              <Text className="text-xs font-semibold mr-1">{log.type}:</Text>
              <Text className="text-xs">{log.time}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};

export default LogItem;
