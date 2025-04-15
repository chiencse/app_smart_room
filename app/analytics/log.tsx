import fetchData from "@/utils/fetchData";
import { useFocusEffect } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native";
import { Table, Row, TableWrapper } from "react-native-table-component";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";

import FontAwesome from "@expo/vector-icons/FontAwesome";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

const device: Record<string, string> = {
  "device.door": "Door",
  "device.lamp": "Light",
  "device.fan": "Fan",
  "device.status-lamp": "Light Auto mode",
  "device.status-fan": "Fan Auto mode",
};

function LogScreen() {
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);

  const [data, setData] = useState([]);
  const [dataRender, setDataRender] = useState([]);
  const [offset, setOffset] = useState(0);

  const [isLoading, setIsLoading] = useState(true);

  const getLogs = () => {
    setIsLoading(true);
    fetchData.getLogs(date).then((response) => {
      setData(
        response.map((ele: any, idx: number) => [
          idx + 1,
          ele.username,
          device[ele.deviceKey],
          ele.value,
          new Date(ele.time).toLocaleString("vi-VN", {
            hour: "2-digit",
            minute: "2-digit",
          }),
        ])
      );
      setOffset(0);
      setIsLoading(false);
    });
  };

  useFocusEffect(useCallback(() => getLogs(), [date]));

  useEffect(() => {
    setDataRender(data.slice(offset * 10, offset * 10 + 10));
  }, [offset, data]);

  const onChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    setShow(false);
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  const showDatePicker = () => {
    setShow(true);
  };

  const tableHead = ["", "User", "Target", "Value", "Time"];
  return (
    <View style={{ backgroundColor: "white", flex: 1 }}>
      <View style={{ padding: 20, marginTop: 20 }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center", gap: 20 }}>
            <Text style={styles.date}>Date: {date.toDateString()}</Text>
            <TouchableOpacity
              style={styles.btnChangeDate}
              onPress={showDatePicker}
            >
              <Text style={{ color: "white", fontWeight: "bold" }}>
                CHANGE DATE
              </Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.btn} onPress={getLogs}>
            <FontAwesome name="refresh" size={24} color="white" />
          </TouchableOpacity>
        </View>

        {show && (
          <DateTimePicker
            value={date}
            mode="date"
            maximumDate={new Date()}
            onChange={onChange}
          />
        )}
      </View>
      {isLoading && <ActivityIndicator size={50} color="#007bff" />}
      {!isLoading && data.length == 0 && (
        <Text style={styles.txtNotfity}>No activity recorded on this day</Text>
      )}
      {!isLoading && data.length > 0 && (
        <ScrollView style={styles.container}>
          <Table>
            <Row
              data={tableHead}
              style={styles.tableHead}
              textStyle={styles.tableHdTxt}
              flexArr={[1, 2, 2, 2, 2]}
            />
            <TableWrapper>
              {dataRender.map((ele: any, idx: number) => {
                if (idx % 2 === 0) {
                  return (
                    <Row
                      key={idx}
                      data={ele}
                      style={{ backgroundColor: "#f2f2f2" }}
                      textStyle={styles.text}
                      flexArr={[1, 2, 2, 2, 2]}
                    />
                  );
                } else {
                  return (
                    <Row
                      key={idx}
                      data={ele}
                      style={{ backgroundColor: "#ffffff" }}
                      textStyle={styles.text}
                      flexArr={[1, 2, 2, 2, 2]}
                    />
                  );
                }
              })}
            </TableWrapper>
          </Table>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              gap: 10,
              margin: 20,
            }}
          >
            <TouchableOpacity
              style={{
                ...styles.btn,
                backgroundColor: offset == 0 ? "#aaa" : "#34E0A1",
              }}
              onPress={() => setOffset(offset - 1)}
              disabled={offset == 0}
            >
              <MaterialIcons
                name="keyboard-arrow-left"
                size={24}
                color="white"
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                ...styles.btn,
                backgroundColor:
                  offset * 10 + 10 >= data.length ? "#aaa" : "#34E0A1",
              }}
              onPress={() => setOffset(offset + 1)}
              disabled={offset * 10 + 10 >= data.length}
            >
              <MaterialIcons
                name="keyboard-arrow-right"
                size={24}
                color="white"
              />
            </TouchableOpacity>
          </View>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  date: {
    fontSize: 16,
  },

  btnChangeDate: {
    backgroundColor: "#2775ec",
    padding: 8,
    borderRadius: 5,
  },

  btn: {
    backgroundColor: "#34E0A1",
    padding: 8,
    borderRadius: 5,
  },

  txtNotfity: {
    padding: 30,
    fontSize: 24,
    color: "#bbb",
    alignSelf: "center",
  },

  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },

  tableHead: {
    height: 40,
    backgroundColor: "#34E0A1",
  },
  tableHdTxt: {
    color: "white",
    margin: 6,
    fontWeight: "bold",
    fontSize: 14,
    textAlign: "center",
  },

  text: {
    margin: 6,
    fontSize: 14,
    textAlign: "center",
  },
});

export default LogScreen;
