import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TextInput, ScrollView, Button, StyleSheet, Keyboard } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import { RichEditor, RichToolbar, actions } from 'react-native-pell-rich-editor';

export const App = () =>  {
  const richText = useRef();
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => setIsKeyboardOpen(true)
    );

    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => setIsKeyboardOpen(false)
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const handleInsertImage = () => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        quality: 1,
        includeBase64: true,
      },
      (response) => {
        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.errorMessage) {
          Alert.alert('Erro', response.errorMessage);
        } else if (response.assets && response.assets.length > 0) {
          const asset = response.assets[0];
          const imageUrl = asset.base64
            ? `data:image/jpeg;base64,${asset.base64}`
            : asset.uri; 
          richText.current?.insertImage(imageUrl);
        }
      }
    );
  };

  // Função para inserir vídeo
  const handleInsertVideo = () => {
    launchImageLibrary(
      {
        mediaType: 'video',
      },
      (response) => {
        if (response.didCancel) {
          console.log('User cancelled video picker');
        } else if (response.errorMessage) {
          Alert.alert('Erro', response.errorMessage);
        } else if (response.assets && response.assets.length > 0) {
          const videoUrl = response.assets[0].uri;
          richText.current?.insertVideo(videoUrl);
        }
      }
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Editor de Texto</Text>
      <ScrollView style={styles.editorContainer}>
        <RichEditor
          ref={richText}
          onChange={(text) => setContent(text)}
          placeholder="Comece a escrever aqui..."
        />
      </ScrollView>
      {
        isKeyboardOpen && (

          <RichToolbar
            editor={richText}
            style={styles.toolbar}
            actions={[
              actions.setBold,
              actions.setItalic,
              actions.setUnderline,
              actions.setStrikethrough,
              actions.code,
              actions.insertBulletsList,
              actions.insertOrderedList,
              actions.insertLink,
              'handleInsertImage',
              'handleInsertVideo',
            ]} 
            iconMap={{ 
              [actions.setBold]: () => <Text style={{fontWeight: 'bold', color: '#fff'}}>Bold</Text>, 
              [actions.setItalic]: () => <Text style={{fontStyle: 'italic', color: '#fff'}}>Italic</Text>,
              //[actions.setUnderline]: () => <Text style={{textDecorationLine: 'underline', color: '#fff'}}>Underline</Text>,
              //[actions.setStrikethrough]: () => <Text style={{color: '#fff'}}>Strike</Text>
              handleInsertImage: () => <Text style={{color: '#fff'}}>Image</Text>,
              handleInsertVideo: () => <Text style={{color: '#fff'}}>Video</Text>
            }}
            iconTint={'#fff'}
            handleInsertImage={handleInsertImage}
            handleInsertVideo={handleInsertVideo}
          />
          
        )
      }
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // padding: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  editorContainer: {
    flex: 1,
    marginBottom: 20,
  },
  resultTitle: {
    marginTop: 20,
    fontWeight: 'bold',
  },
  toolbar: {
    width: '100%',
    alignItems: 'center',
    backgroundColor: '#15181B',
  },
});

export default App;
