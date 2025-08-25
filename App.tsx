import { StyleSheet } from 'react-native'
import React from 'react'
import { Provider } from 'react-redux'
import { store } from './src/store/store'
import AppNavigation from './src/navigation/AppNavigation'
import { SafeAreaProvider } from 'react-native-safe-area-context'

const App = () => {
  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <AppNavigation />
      </SafeAreaProvider>
    </Provider>
  )
}

export default App

const styles = StyleSheet.create({})