# Configuración de Google Maps

## Estado Actual
✅ **Implementación Completada**
- ✅ Reemplazado Leaflet con react-native-maps

- ✅ Componente Map actualizado para usar Google Maps
- ✅ Configuración nativa establecida en app.json

## Para que funcione correctamente, ejecuta:

1. **Instalar dependencias:**
   ```bash
   npm install
   # o si hay problemas de permisos:
   sudo npm install
   ```

2. **Limpiar y reconstruir:**
   ```bash
   npx expo prebuild --clean
   ```

3. **Ejecutar la app:**
   ```bash
   npx expo run:android
   # o
   npx expo run:ios
   ```

## Si sigue cargando infinitamente:

1. **Verificar API Key en Google Cloud Console:**
   - Ve a https://console.cloud.google.com/

   - Asegúrate que tenga habilitadas estas APIs:
     - Maps SDK for Android
     - Maps SDK for iOS
     - Maps JavaScript API (para web)

2. **Verificar restricciones de la API Key:**
   - Asegúrate que no tenga restricciones de dominio/IP muy estrictas
   - Para desarrollo, puedes remover todas las restricciones temporalmente

3. **Si necesitas crear una nueva API Key:**
   - Actualiza el archivo `.env` con la nueva key
   - Actualiza `app.json` con la nueva key
   - Ejecuta `npx expo prebuild --clean`

## Archivos Modificados:
- ✅ `package.json` - Agregado react-native-maps 1.20.1
- ✅ `app.json` - Configuración de API Key para iOS/Android
- ✅ `.env` - Variable de entorno para API Key
- ✅ `src/modules/location/components/Map.tsx` - Componente actualizado
- ✅ Removidas dependencias de Leaflet

## Fallback si Google Maps no funciona:
El componente tiene un timeout de 5 segundos que automáticamente quitará el loading state y mostrará la interfaz aunque el mapa no cargue completamente.