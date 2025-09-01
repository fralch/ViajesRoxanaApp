# Map Setup Guide

This guide explains the cross-platform map functionality in the ViajesRoxanaApp using `expo-location` for location services and a custom coordinate display component.

## Features Implemented

- Cross-platform location display compatible with web and mobile
- Student location coordinates with custom styling
- Address display when available
- External map integration (Google Maps, Waze)
- Real-time location updates
- Clean, modern UI with coordinate display
- Direct links to external map applications

### Componente MapScreen
- **Ubicación**: `src/modules/location/components/MapScreen.tsx`
- **Pantalla completa** para el mapa
- **Navegación integrada** con React Navigation
- **Parámetros de ruta** para coordenadas y datos del estudiante
- **Botón de cerrar** para regresar

### Integración con la Aplicación:

- **DashboardScreen**: Botón "Ver Ubicación" navega al mapa con las coordenadas del hijo seleccionado
- **LiveLocationScreen**: Botón "Ver en Mapa" abre el mapa con la ubicación actual
- **Navegación**: Se agregó MapScreen al stack navigator

## Configuration

### Location Services

Location permissions are handled by `expo-location`. The app will request location permissions when needed.

### Cross-Platform Compatibility

The map component automatically detects the platform and provides:
- **Web**: Coordinate display with external map links
- **Mobile**: Same coordinate display with native app integration

### Installation

The dependencies are already installed:
```bash
npm install expo-location
```

### Configuración de Google Maps (Opcional)

Para usar Google Maps en lugar del proveedor por defecto:

1. Obtén una API key de Google Maps desde [Google Cloud Console](https://console.cloud.google.com/)
2. Configura la API key en tu `app.json` o `app.config.js`:

```json
{
  "expo": {
    "android": {
      "config": {
        "googleMaps": {
          "apiKey": "TU_GOOGLE_MAPS_API_KEY"
        }
      }
    },
    "ios": {
      "config": {
        "googleMapsApiKey": "TU_GOOGLE_MAPS_API_KEY"
      }
    }
  }
}
```

## Datos de Ubicación

### Coordenadas de Ejemplo:

- **Diego García (Cusco)**: 
  - Latitud: -13.1631
  - Longitud: -72.5450
  - Dirección: Hotel Imperial Cusco, Av. Imperial 345, Cusco

- **Lucía García (Huaraz)**:
  - Latitud: -9.0215
  - Longitud: -77.6283
  - Dirección: Laguna 69, Huascarán National Park, Huaraz

## Funcionalidades del Mapa

- **Zoom**: Permite acercar y alejar el mapa
- **Navegación**: Desplazamiento y rotación del mapa
- **Marcador Personalizado**: Muestra la ubicación exacta del estudiante
- **Información**: Panel con coordenadas y botones de acción
- **Animación**: Transición suave al cargar la ubicación

## Próximas Mejoras

- [ ] Integración con GPS en tiempo real
- [ ] Historial de ubicaciones (ruta seguida)
- [ ] Geofencing (alertas por zonas)
- [ ] Múltiples marcadores (grupo completo)
- [ ] Modo offline
- [ ] Compartir ubicación por WhatsApp/SMS

## Dependencies

```json
{
  "expo-location": "^17.0.1"
}
```

## Uso

1. Desde el Dashboard, selecciona un hijo y presiona "Ver Ubicación"
2. Desde la pantalla de Ubicación en Vivo, presiona "Ver en Mapa"
3. El mapa se abrirá mostrando la ubicación actual del estudiante
4. Usa los controles para navegar por el mapa
5. Presiona el botón X para cerrar y regresar

---

**Nota**: La configuración de Google Maps API es opcional. react-native-maps funciona con el proveedor de mapas por defecto de cada plataforma.