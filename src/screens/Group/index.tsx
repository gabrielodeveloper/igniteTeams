import { useCallback, useState } from 'react';
import { FlatList } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';

import { groupsGetAll } from '@storage/group/groupsGetAll';

import { ListEmpty } from '@components/ListEmpty';
import { Highlight } from '@components/Highlight';
import { GroupCard } from '@components/GroupCard';
import { Loading } from '@components/Loading';
import { Header } from '@components/Header';
import { Button } from '@components/Button';

import { Container } from './styles';

export function Group() {
  const [groups, setGroups] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const navigation = useNavigation();

  function handleNewGroup() {
    navigation.navigate('new')
  }

  async function fetchGroup() {
    try {
      setIsLoading(true);
      const data = await groupsGetAll();
      setGroups(data);

    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }

  function handleOpenGroup(group: string) {
    navigation.navigate('players', { group });
  }

  useFocusEffect(useCallback(() => {
    fetchGroup();
  }, []))

  return (
    <Container>
      <Header />

      <Highlight
        title="Turmas"
        subtitle="Jogue com a sua turma"
      />

      {
        isLoading ? <Loading /> :

          <FlatList
            data={groups}
            keyExtractor={item => item}
            renderItem={({ item }) => (
              <GroupCard
                title={item}
                onPress={() => handleOpenGroup(item)}
              />
            )}
            contentContainerStyle={groups.length === 0 && { flex: 1 }}
            ListEmptyComponent={() => (
              <ListEmpty
                message="Que tal cadastrar a primeira turma ?"
              />
            )}
            showsVerticalScrollIndicator={false}
          />
      }

      <Button
        title="Criar nova turma"
        onPress={handleNewGroup}
      />
    </Container>
  );
}

