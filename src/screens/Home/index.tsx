import React, { useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

import { Header } from '../../components/Header';
import { SearchBar } from '../../components/SearchBar';
import { LoginDataItem } from '../../components/LoginDataItem';

import {
  Container,
  Metadata,
  Title,
  TotalPassCount,
  LoginList,
} from './styles';

interface LoginDataProps {
  id: string;
  service_name: string;
  email: string;
  password: string;
};

type LoginListDataProps = LoginDataProps[];

export function Home() {
  const [searchText, setSearchText] = useState('');
  const [searchListData, setSearchListData] = useState<LoginListDataProps>([]);
  const [data, setData] = useState<LoginListDataProps>([]);

  async function loadData() {
    const dataKey = '@savepass:logins';
    const response = await AsyncStorage.getItem(dataKey)

    if(response) {
      const parsedData = JSON.parse(response);
      setSearchListData(parsedData)
      setData(parsedData)
    }

  }

  function handleFilterLoginData() {
    if (searchText.trim() === '') {
      setSearchListData(data);
    } else {
      const filteredData = data.filter((item) =>
        item.service_name.toLowerCase().includes(searchText.toLowerCase())
      );
      setSearchListData(filteredData);
    }
  }

  function handleChangeInputText(text: string) {
    setSearchText(text)
  }

  useFocusEffect(useCallback(() => {
    loadData();
  }, []));

  return (
    <>
      <Header
        user={{
          name: 'Elisa',
          avatar_url: 'https://pps.whatsapp.net/v/t61.24694-24/344894467_129549750090818_1772470785663492525_n.jpg?ccb=11-4&oh=01_AdRfhlbwGI3E1h1Yqh6v6fRkwKjor3evS9UDe4MG0jck1g&oe=6479B3D0'
        }}
      />
      <Container>
        <SearchBar
          placeholder="Qual senha você procura?"
          onChangeText={handleChangeInputText}
          value={searchText}
          returnKeyType="search"
          onSubmitEditing={handleFilterLoginData}

          onSearchButtonPress={handleFilterLoginData}
        />

        <Metadata>
          <Title>Suas senhas</Title>
          <TotalPassCount>
            {searchListData.length
              ? `${`${searchListData.length}`.padStart(2, '0')} ao total`
              : 'Nada a ser exibido'
            }
          </TotalPassCount>
        </Metadata>

        <LoginList
          keyExtractor={(item) => item.id}
          data={searchListData} 
          renderItem={({ item }) => (
            <LoginDataItem
              service_name={item.service_name}
              email={item.email}
              password={item.password}
            />
          )}
        />
      </Container>
    </>
  )
}