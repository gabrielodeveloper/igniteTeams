import { useEffect, useState, useRef } from "react";
import { useRoute, useNavigation } from "@react-navigation/native";
import { Alert, FlatList, TextInput } from "react-native";

import { playersGetByGroupAndTeam } from "@storage/player/playersGetByGroupAndTeam";
import { playerRemoveByGroup } from "@storage/player/playerRemoveByGroup";
import { groupRemoveByName } from "@storage/group/groupRemoveByName";
import { playerAddByGroup } from "@storage/player/playerAddByGroup";
import { PlayerStorageDTO } from "@storage/player/PlayerStorageDTO";

import { AppError } from "@utils/AppError";

import { ButtonIcon } from "@components/ButtonIcon";
import { PlayerCard } from "@components/PlayerCard";
import { Highlight } from "@components/Highlight";
import { ListEmpty } from "@components/ListEmpty";
import { Loading } from "@components/Loading";
import { Header } from "@components/Header";
import { Button } from "@components/Button";
import { Filter } from "@components/Filter";
import { Input } from "@components/Input";

import { Container, Form, HeaderList, NumberOfPlayers } from "./styles";

type RouteParams = {
  group: string;
}

export function Players() {
  const [players, setPlayers] = useState<PlayerStorageDTO[]>([]);
  const [newPlayerName, setNewPlayerName] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [team, setTeam] = useState('Time A');

  const route = useRoute();
  const { group } = route.params as RouteParams;
  
  const newPlayerNameInputRef = useRef<TextInput>(null);
  const navigation = useNavigation();

  async function handlePlayerAdd() {
    if (newPlayerName.trim().length === 0) {
      return Alert.alert('Novo Pessoa', 'Informe o nome da pessoa para adicionar.');
    }

    const newPlayer = {
      name: newPlayerName,
      team
    }

    try {
      await playerAddByGroup(newPlayer, group);

      newPlayerNameInputRef.current?.blur();

      fetchPlayersByTeam();
      setNewPlayerName('');

    } catch (error) {
      if (error instanceof AppError) {
        Alert.alert('Novo jogador', error.message);
      } else {
        console.log(error);
        Alert.alert('Novo jogador', 'Não foi possível adicionar este jogador.');
      }
    }
  }

  async function fetchPlayersByTeam() {
    try {
      setIsLoading(true);
      const playersByTeam = await playersGetByGroupAndTeam(group, team);
      setPlayers(playersByTeam);

    } catch (error) {
      console.log(error);
      Alert.alert('Pessoa', 'Não foi possível carregar as pessoas do time selecionado.');
    } finally {
      setIsLoading(false);
    }
  }

  async function handlePlayerRemove(playerName: string) {
    try {
      await playerRemoveByGroup(playerName, group);
      fetchPlayersByTeam();

    } catch (error) {
      console.log(error);
      Alert.alert('Remover pessoa', 'Não foi possível remover essa pessoa.');
    }
  }

  function handleGroupRemove() {
    Alert.alert('Remover grupo', 'Deseja remover essa turma ?', [
      { text: 'Sim', onPress: () => groupRemove() },
      { text: 'Não', style: 'cancel' }
    ])
  }

  async function groupRemove() {
    try {
      await groupRemoveByName(group);
      navigation.navigate('groups');

    } catch (error) {
      console.log(error);
      Alert.alert('Remover grupo', 'Não foi possível remover este grupo')
    }
  }

  useEffect(() => {
    fetchPlayersByTeam();
  }, [team]);


  return (
    <Container>
      <Header showBackButton />

      <Highlight
        title={group}
        subtitle="adicione a galera e separe os times"
      />

      <Form>
        <Input
          placeholder="Nome da pessoa"
          autoCorrect={false}
          inputRef={newPlayerNameInputRef}
          onChangeText={setNewPlayerName}
          value={newPlayerName}
          onSubmitEditing={handlePlayerAdd}
          returnKeyType="done"
        />

        <ButtonIcon
          icon="add"
          onPress={handlePlayerAdd}
        />
      </Form>


      <HeaderList>
        <FlatList
          data={['Time A', 'Time B']}
          keyExtractor={item => item}
          renderItem={({ item }) => (
            <Filter
              title={item}
              isActive={item === team}
              onPress={() => setTeam(item)}
            />
          )}
          showsHorizontalScrollIndicator={false}
          horizontal
        />

        <NumberOfPlayers>
          {players.length}
        </NumberOfPlayers>
      </HeaderList>

      {
        isLoading ? <Loading /> :

          <FlatList
            data={players}
            keyExtractor={item => item.name}
            renderItem={({ item }) => (
              <PlayerCard
                name={item.name}
                onRemove={() => handlePlayerRemove(item.name)}
              />
            )}
            ListEmptyComponent={() => (
              <ListEmpty
                message="Não há pessoas nesse time."
              />
            )}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={[{ paddingBottom: 100 }, players.length === 0 && { flex: 1 }]}
          />
      }

      <Button
        onPress={handleGroupRemove}
        title="Remover turma"
        type="SECONDARY"
      />
    </Container>
  )
}