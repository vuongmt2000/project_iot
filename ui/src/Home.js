import React, { useState, useEffect } from 'react'
import { StyleSheet, Text, View, Dimensions, ScrollView } from 'react-native'
import { Switch } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context'
import { LineChart } from 'react-native-chart-kit';


const screenWidth = Dimensions.get("screen").width
export default function Home(props) {

    const name = props.route?.params?.name ?? ""
    const token = props.route?.params?.token ?? ""
    const [isSwitchOnLed, setIsSwitchOnLed] = React.useState(false);
    const [isSwitchOnSound, setIsSwitchOnSound] = React.useState(false);
    const onToggleSwitch = () => setIsSwitchOnLed(!isSwitchOnLed);
    const onToggleSwitch1 = () => setIsSwitchOnSound(!isSwitchOnSound);
    const [sound, setSound] = useState(0)
    const [minSound, setMinSound] = useState(0)
    const [maxSound, setMaxSound] = useState(0)
    const [gas, setGas] = useState(0)
    const [dataLed, setDataLed] = useState([20, 45, 28, 80, 99, 43])
    const [dataSound, setDataSound] = useState([20, 45, 28, 80, 99, 43])
    const [labels, setLabels] = useState(["January", "February", "March", "April", "May", "June"])
    const axios = require('axios');

    useEffect(() => {
        // Make a request for a user with a given ID
        axios.get('http://localhost:7000/sensor', {
            headers: {
                'x-access-token': `${token}`
            }
        }) 
            .then(function (response) {
                // handle success
                const res = response.data.data
                setIsSwitchOnLed(res[1].data.status)
                console.log(`res[1].data.status`, res[1].data.status)
                setIsSwitchOnSound(res[3].data.auto)
                setSound(res[3].data.value)
                setMinSound(res[3].data.min_range)
                setMaxSound(res[3].data.max_range)
                setGas(res[2].data.value)
                let l = []
                let s = []
                let b = []
                response.data.data[0].data.forEach((x, i) => {
                    l.push(Math.floor(x.humidity))
                    s.push(Math.floor(x.temperature))
                    if (i % 3 === 0) {
                        b.push(x.time.toString())
                    } else {
                        b.push('')
                    }

                })
                setDataLed(l)
                setDataSound(s)
                setLabels(b)
            })
            .catch(function (error) {
                // handle error
                console.log(error);
            })
            .then(function () {
                // always executed
            });

    }, [])

    useEffect(() => {
        console.log(`22222222`, 22222222)
        axios.put('http://localhost:7000/sensor', 
           {
                "name": "led",
                "data": {
                    "status": isSwitchOnLed
                }
            }
            , {
                headers: {
                    'x-access-token': `${token}`,
                    "Content-Type" : "application/json"
                }
               
        } )
          .then(function (response) {
             console.log(`response.data`, response.data)
          })
          .catch(function (error) {
            console.log(error);
          });
    }, [isSwitchOnLed])
    const chartConfig = {
        backgroundGradientFrom: "white",
        backgroundGradientFromOpacity: 0,
        backgroundGradientTo: "white",
        backgroundGradientToOpacity: 0.5,
        color: (opacity = 0) => `rgba(0, 0, 0, ${opacity})`,
        strokeWidth: 2, // optional, default 3
        barPercentage: 0.5,
        useShadowColorFromDataset: false // optional
    };
    const dataL = {
        labels: labels,
        datasets: [
            {
                data: dataLed,
                color: (opacity = 0) => `rgba(0, 0, 0, ${opacity})`, // optional
                strokeWidth: 2 // optional
            }
        ],
        legend: ["humidity"] // optional
    };
    const dataS = {
        labels: labels,
        datasets: [
            {
                data: dataSound,
                color: (opacity = 0) => `rgba(0, 0, 0, ${opacity})`, // optional
                strokeWidth: 2 // optional
            }
        ],
        legend: ["temperature"] // optional
    };
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <ScrollView style={{ flex: 1 }}>
                <Text style={{ fontSize: 18, fontWeight: "bold", marginLeft: 8 }}>Smart Home</Text>
                <Text style={{ fontSize: 16, marginLeft: 8 }}>welcome to {name}</Text>
                <View style={{ flexDirection: "row", alignItems: "center", marginTop: 20 }}>
                    <Text style={{ fontSize: 18, marginLeft: 16, marginRight: 30 }}>Led</Text>
                    <Switch value={isSwitchOnLed} onValueChange={onToggleSwitch} />
                </View>
                <View style={{
                    height: 120,
                    marginTop: 20, marginLeft: 16, marginRight: 16, borderWidth: 0.5, borderColor: "black"
                }}>
                    <View style={{ flexDirection: "row", justifyContent: "space-between", padding: 8 }}>
                        <Text>Sound</Text>
                        <Text style={{ fontWeight: "bold", fontSize: 18 }}>{sound}</Text>
                    </View>
                    <View style={{ flexDirection: "row", justifyContent: "space-between", padding: 8 }}>
                        <Text>Auto</Text>
                        <Switch value={isSwitchOnSound} onValueChange={onToggleSwitch1} />
                    </View>
                    <View style={{ flexDirection: "row", justifyContent: "space-between", padding: 8 }}>
                        <Text>Range</Text>
                        <Text>min: {minSound} ➜ max: {maxSound} </Text>
                    </View>
                </View>
                <View style={{
                    height: 120,
                    marginTop: 20, marginLeft: 16, marginRight: 16, borderWidth: 0.5, borderColor: "red"
                }}>
                    <Text style={{ padding: 8, fontSize: 20, color: "red", fontWeight: "bold" }}>GAS sensor</Text>
                    <View style={{ flexDirection: "row", justifyContent: "space-between", padding: 8 }}>
                        <Text>Value</Text>
                        <Text style={{ fontWeight: "bold", fontSize: 18 }}>{gas}</Text>
                    </View>
                    <View style={{ flexDirection: "row", justifyContent: "space-between", padding: 8 }}>
                        <Text>State</Text>
                        <Text style={{ fontSize: 20, color: 'red', fontWeight: "bold" }}>Danger</Text>
                    </View>
                </View>
                <View style={{ justifyContent: "center", alignItems: "center", marginTop: 20 }}>
                    <LineChart
                        data={dataL}
                        width={screenWidth - 32}
                        height={256}
                        verticalLabelRotation={30}
                        chartConfig={chartConfig}
                        bezier
                    />
                    <LineChart
                        style={{ marginTop: 20 }}
                        data={dataS}
                        width={screenWidth - 32}
                        height={256}
                        verticalLabelRotation={30}
                        chartConfig={chartConfig}
                        bezier
                    />
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({})
