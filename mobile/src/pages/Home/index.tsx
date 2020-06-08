import React, { useEffect, useState } from 'react';
import { View, Image, ImageBackground, StyleSheet, Text } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native'
import { Feather as Icon } from '@expo/vector-icons'

import {Picker} from '@react-native-community/picker';

const logo = require ('../../assets/logo.png');
const homeBackground = require ('../../assets/home-background.png');

import axios from 'axios';

interface UFIBGEResponse {
    sigla: string
}

interface MunicipioIBGEResponse {
    nome: string;
}

const Home = () => {
    const navigation = useNavigation();

    const [ufs, setUFs] = useState<string[]>([]);
    const [cities, setCities] = useState<string[]>([]);

    const [selectedUF, setSelectedUF] = useState('0');
    const [selectedCity, setSelectedCity] = useState('0');
    
    useEffect(() => {
        axios.get<UFIBGEResponse[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome')
            .then(response => {
                const ufInitials = response.data.map(uf => uf.sigla);
                setUFs(ufInitials);
            })
    }, []);

    useEffect(() => {
        if (selectedUF === '0') return;

        axios.get<MunicipioIBGEResponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUF}/municipios?orderBy=nome`)
            .then(response => {
                const citiesName = response.data.map(city => city.nome);
                setCities(citiesName);
            })
    }, [selectedUF]);

    function handleNavigateToPoints() {
        if(selectedCity === '0')
            return;

        navigation.navigate('Points', {city: selectedCity, uf: selectedUF});
    }

    return (
        <ImageBackground 
            source={homeBackground} 
            style={styles.container}
            imageStyle={styles.imageBackground}
        >
            <View style={styles.main}>
                <Image source={logo}/>
                <Text style={styles.title}>Seu marketplace de coleta de resíduos</Text>
                <Text style={styles.description}>Ajudamos pessoas a encontrarem pontos de coleta de forma eficiente</Text>
            </View>

            <View>
                <Picker
                    selectedValue={selectedUF}
                    itemStyle={styles.pickerSelectText}
                    onValueChange={(itemValue, itemIndex) => 
                        setSelectedUF(String(itemValue))
                    }>
                    <Picker.Item label="Selecione a UF" value="0" />
                    {
                        ufs.map(uf => (
                            <Picker.Item key={uf} label={uf} value={uf}/>
                        ))
                    }
                </Picker>

                <Picker
                    selectedValue={selectedCity}
                    itemStyle={styles.pickerSelectText}
                    onValueChange={(itemValue, itemIndex) => 
                        setSelectedCity(String(itemValue))
                    }>
                    <Picker.Item label="Selecione a Cidade" value="0" />
                    {
                        cities.map(city => (
                            <Picker.Item key={city} label={city} value={city}/>
                        ))
                    }
                </Picker>
            </View>

            <View style={styles.footer}>
                <RectButton style={styles.button} onPress={handleNavigateToPoints}>
                    <View style={styles.buttonIcon}>
                        <Text>
                            <Icon name="arrow-right" color="#FFF" size={24} />
                        </Text>
                    </View>

                    <Text style={styles.buttonText}>
                        Entrar
                    </Text>
                </RectButton>
            </View>
        </ImageBackground>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 32
    },

    imageBackground: {
        width: 264,
        height: 300
    },

    main: {
        flex: 1,
        justifyContent: 'center',
    },

    title: {
        color: '#322153',
        fontSize: 32,
        fontFamily: 'Ubuntu_700Bold',
        maxWidth: 260,
        marginTop: 64,
    },

    description: {
        color: '#6C6C80',
        fontSize: 16,
        marginTop: 16,
        fontFamily: 'Roboto_400Regular',
        maxWidth: 260,
        lineHeight: 24,
    },

    footer: {},

    select: {},

    input: {
        height: 60,
        backgroundColor: '#FFF',
        borderRadius: 10,
        marginBottom: 8,
        paddingHorizontal: 24,
        fontSize: 16,
    },

    button: {
        backgroundColor: '#34CB79',
        height: 60,
        flexDirection: 'row',
        borderRadius: 10,
        overflow: 'hidden',
        alignItems: 'center',
        marginTop: 8,
    },

    buttonIcon: {
        height: 60,
        width: 60,
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
        borderTopLeftRadius: 10,
        borderBottomLeftRadius: 10,
        justifyContent: 'center',
        alignItems: 'center'
    },

    buttonText: {
        flex: 1,
        justifyContent: 'center',
        textAlign: 'center',
        color: '#FFF',
        fontFamily: 'Roboto_500Medium',
        fontSize: 16,
    },

    pickerSelectText: {
        fontSize: 36
    }
});

export default Home;