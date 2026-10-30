import { Image, type ImageSource } from 'expo-image';
import { StyleSheet } from 'react-native';

type Props = {
  imgSource: ImageSource;
  selectedImage?: string;
};

export default function ImageViewer({ imgSource, selectedImage }: Props) {
  const imageSource = selectedImage ? { uri: selectedImage } : imgSource;

  return (
    <Image
      source={imageSource}
      style={styles.image}
      contentFit="cover"
      transition={200}
    />
  );
}

const styles = StyleSheet.create({
  image: {
    width: '100%',
    height: '100%',
  },
});
