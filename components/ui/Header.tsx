import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { StyleSheet, Text, View } from "react-native";

interface TitleProps {
  title: string;
}

function Header({ title }: TitleProps) {
  const colorScheme = useColorScheme();
  
  return (
    <View style={styles.container}>
      <View style={[
        styles.header, 
        { backgroundColor: colorScheme === 'dark' ? Colors.dark.background : '#fff' }
      ]}>
        <Text style={[
          styles.headerTitle,
          { color: Colors[colorScheme ?? 'light'].text }
        ]}>
          {title}
        </Text>
      </View>
    </View>
  );
}

export default Header;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 60, // Account for status bar
    paddingBottom: 15,
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "400",
  },
});