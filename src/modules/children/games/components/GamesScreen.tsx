import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { MaterialIcons, AntDesign } from '@expo/vector-icons';
import { Card } from '../../../../shared/components';

const GamesScreen = ({ navigation }: any) => {
  const [selectedGame, setSelectedGame] = useState<number | null>(null);
  const [animatedValue] = useState(new Animated.Value(1));

  const games = [
    {
      id: 1,
      title: 'Veo, Veo',
      subtitle: 'Encuentra cosas durante el viaje',
      icon: 'visibility',
      color: '#4CAF50',
      description: 'Mira por la ventana y encuentra cosas que empiecen con diferentes letras.',
    },
    {
      id: 2,
      title: 'Contar Carros',
      subtitle: 'Cuenta diferentes tipos de vehículos',
      icon: 'directions-car',
      color: '#2196F3',
      description: 'Cuenta cuántos carros rojos, azules o de otros colores ves en el camino.',
    },
    {
      id: 3,
      title: 'Adivina el Animal',
      subtitle: 'Juego de adivinanzas',
      icon: 'pets',
      color: '#e74c3c',
      description: 'Piensa en un animal y que otros adivinen cuál es con pistas.',
    },
    {
      id: 4,
      title: 'Canciones de Viaje',
      subtitle: 'Canta tus canciones favoritas',
      icon: 'music-note',
      color: '#9C27B0',
      description: 'Disfruta cantando canciones divertidas durante el viaje.',
    },
    {
      id: 5,
      title: 'Historia Colaborativa',
      subtitle: 'Crear historias juntos',
      icon: 'auto-stories',
      color: '#FF5722',
      description: 'Cada persona dice una parte de la historia, creando aventuras increíbles.',
    },
    {
      id: 6,
      title: 'Números y Letras',
      subtitle: 'Encuentra números en las placas',
      icon: 'looks-one',
      color: '#607D8B',
      description: 'Busca números específicos o letras en las placas de los carros que ves.',
    },
  ];

  const handleGamePress = (gameId: number) => {
    setSelectedGame(selectedGame === gameId ? null : gameId);

    Animated.sequence([
      Animated.timing(animatedValue, {
        toValue: 0.95,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
        {/* Header */}
        <View style={styles.header}>
          <MaterialIcons name="games" size={40} color="#e74c3c" />
          <Text style={styles.title}>Juegos de Viaje</Text>
          <Text style={styles.subtitle}>
            ¡Diviértete mientras viajas de forma segura!
          </Text>
        </View>

        {/* Games List */}
        <View style={styles.gamesSection}>
          {games.map((game) => (
            <Animated.View
              key={game.id}
              style={[
                { transform: [{ scale: selectedGame === game.id ? animatedValue : 1 }] }
              ]}
            >
              <TouchableOpacity
                onPress={() => handleGamePress(game.id)}
                activeOpacity={0.7}
              >
                <Card margin={5}>
                  <View style={styles.gameHeader}>
                    <View style={[styles.gameIcon, { backgroundColor: game.color }]}>
                      <MaterialIcons
                        name={game.icon as any}
                        size={28}
                        color="#fff"
                      />
                    </View>
                    <View style={styles.gameInfo}>
                      <Text style={styles.gameTitle}>{game.title}</Text>
                      <Text style={styles.gameSubtitle}>{game.subtitle}</Text>
                    </View>
                    <AntDesign
                      name={selectedGame === game.id ? 'up' : 'down'}
                      size={16}
                      color="#666"
                    />
                  </View>

                  {selectedGame === game.id && (
                    <View style={styles.gameDescription}>
                      <Text style={styles.descriptionText}>
                        {game.description}
                      </Text>
                      <TouchableOpacity style={[styles.playButton, { backgroundColor: game.color }]}>
                        <MaterialIcons name="play-arrow" size={20} color="#fff" />
                        <Text style={styles.playButtonText}>¡Jugar Ahora!</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </Card>
              </TouchableOpacity>
            </Animated.View>
          ))}
        </View>

        {/* Safety Tip */}
        <Card backgroundColor="#E8F5E8" margin={10}>
          <View style={styles.safetyHeader}>
            <AntDesign name="safety" size={20} color="#4CAF50" />
            <Text style={styles.safetyTitle}>Recuerda</Text>
          </View>
          <Text style={styles.safetyText}>
            Siempre mantén tu cinturón puesto mientras juegas y avisa si necesitas algo durante el viaje.
          </Text>
        </Card>

        {/* Navigation Button */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <AntDesign name="left" size={20} color="#fff" />
          <Text style={styles.backButtonText}>Volver al Inicio</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 5,
  },
  gamesSection: {
    marginBottom: 25,
  },
  gameCard: {
    marginBottom: 15,
  },
  gameHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  gameIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gameInfo: {
    flex: 1,
    marginLeft: 15,
  },
  gameTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  gameSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  gameDescription: {
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  descriptionText: {
    fontSize: 14,
    color: '#555',
    lineHeight: 20,
    marginBottom: 15,
  },
  playButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignSelf: 'flex-start',
  },
  playButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 5,
  },
  safetyCard: {
    marginBottom: 25,
    backgroundColor: '#E8F5E8',
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  safetyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  safetyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2E7D32',
    marginLeft: 8,
  },
  safetyText: {
    fontSize: 14,
    color: '#388E3C',
    lineHeight: 18,
  },
  backButton: {
    backgroundColor: '#d62d28',
    borderRadius: 25,
    paddingVertical: 15,
    paddingHorizontal: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 30,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 10,
  },
});

export default GamesScreen;