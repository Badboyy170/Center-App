import { StyleSheet, Appearance, Platform, SafeAreaView, ScrollView, FlatList, View, Text, Image, TouchableOpacity, ImageBackground, TextInput } from "react-native";
// import { Colors } from '@/constants/Colors';
// import { MENU_ITEMS } from '@/constants/Menuitems';
// import MENU_IMAGES from '@/constants/MenuImages'; 
import { useState } from "react";
import ice from "@/assets/images/image1.jpg";
// import empty from "@/assets/images/empty";


export default function CenterManagementScreen() {
    const colorScheme = Appearance.getColorScheme();
    const theme =  {
        text: '#11181C',
        background: '#fff',
        headerbackground:'rgb(242,242,242)',
        tint: "red",
        icon: '#687076',
        tabIconDefault: '#c68e17',
        tabIconSelected: "red",
      }
    const styles = createStyles(theme, colorScheme);
    const Container = Platform.OS === 'web' ? ScrollView : SafeAreaView;

    const [centers, setCenters] = useState([]);
    const [newCenterName, setNewCenterName] = useState('');
    const [newGroupName, setNewGroupName] = useState('');

    const addCenter = () => {
        if (newCenterName.trim() === '') return;
        const newCenter = {
            id: Date.now(),
            title: newCenterName,
            group: newGroupName.trim() || 'No group',
            description: 'New center',
        };
        setCenters([...centers, newCenter]);
        setNewCenterName('');
        setNewGroupName('');
    };

    const removeCenter = (id) => {
        setCenters((prevData) => prevData.filter((item) => item.id !== id));
    };

    // const resetList = () => {
    //     setCenters(MENU_ITEMS);
    // };

    return (
        <View style={styles.container}>
            <ImageBackground source={ice} resizeMode='cover' style={styles.image}>
                <Container>
                    <Text style={styles.title}>Centers Management</Text>

                    <View style={styles.addCenterContainer}>
                        <TextInput
                            style={styles.input}
                            placeholder="Center name"
                            value={newCenterName}
                            onChangeText={setNewCenterName}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Group name"
                            value={newGroupName}
                            onChangeText={setNewGroupName}
                        />
                        <TouchableOpacity style={styles.addButton} onPress={addCenter}>
                            <Text style={styles.addButtonText}>Add center</Text>
                        </TouchableOpacity>
                    </View>

                    <FlatList
                        data={centers}
                        keyExtractor={(item) => item.id.toString()}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.contentContainer}
                        ItemSeparatorComponent={<View style={styles.separator} />}
                        // ListFooterComponent={
                        //     <TouchableOpacity style={styles.resetButton} onPress={resetList}>
                        //         <Text style={styles.resetButtonText}>Reset</Text>
                        //     </TouchableOpacity>
                        // }
                        ListFooterComponentStyle={styles.footerComp}
                        ListEmptyComponent={
                            // <View style={{ alignItems: 'center', marginTop: 30 }}>
                            //   {/* <Image 
                            //     source={require('@/assets/images/empty.jpg')} 
                            //     style={{ width: 150, height: 150, marginBottom: 10 }} 
                            //     resizeMode="cover"
                            //   /> */}
                              <Text style={styles.emptyText}>No Center Found</Text>
                            // </View>
                          }
                        
                          
                       
                          
                        renderItem={({ item }) => (
                            <View style={styles.row}>
                                <View style={styles.menuTextRow}>
                                    <Text style={[styles.menuItemTitle, styles.menuItemText]}>{item.title}</Text>
                                    <Text style={styles.menuItemText}>{item.description}</Text>
                                    {item.group && (
                                        <Text style={styles.menuItemText}>Group: {item.group}</Text>
                                    )}
                                </View>
                              
                                <TouchableOpacity style={styles.deleteButton} onPress={() => removeCenter(item.id)}>
                                    <Text style={styles.deleteButtonText}>X</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    />
                </Container>
            </ImageBackground>
        </View>
    );
}

function createStyles(theme, colorScheme) {
    return StyleSheet.create({
        container: {
            flex: 1,
        },
        title: {
            fontSize: 24,
            fontWeight: 'bold',
            marginTop: 20,
            marginBottom: 10,
            textAlign: 'center',
            color: theme.text,
        },
        addCenterContainer: {
            //backgroundColor: 'green',
            flexDirection: 'column',
            paddingHorizontal: 12,
            gap: 10,
            marginBottom: 15,
        },
        input: {
            backgroundColor: '#F0F0F0',
            paddingHorizontal: 10,
            borderRadius: 10,
            height: 45,
            borderColor: '#ccc',
            borderWidth: 1,
            marginBottom: 10,
        },
        addButton: {
            backgroundColor: 'green',
            paddingHorizontal: 15,
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 10,
            height: 45,
        },
        addButtonText: {
            color: '#fff',
            fontWeight: 'bold',
        },
        contentContainer: {
            paddingBottom: 40,
            paddingHorizontal: 12,
            backgroundColor: theme.background,
        },
        separator: {
            height: 1,
            backgroundColor: colorScheme === 'dark' ? 'papayawhip' : "#000",
            width: '50%',
            maxWidth: 300,
            marginHorizontal: 'auto',
            marginBottom: 10,
        },
        footerComp: {
            marginTop: 20,
        },
        row: {
            flexDirection: 'row',
            width: '100%',
            height: 100,
            marginBottom: 10,
            borderWidth: 1,
            borderColor: colorScheme === 'dark' ? 'papayawhip' : '#000',
            borderRadius: 20,
            overflow: 'hidden',
            marginHorizontal: 'auto',
            alignItems: 'center',
            position: 'relative',
        },
        menuTextRow: {
            width: '65%',
            paddingTop: 10,
            paddingLeft: 10,
            paddingRight: 5,
            flexGrow: 1,
        },
        menuItemTitle: {
            fontSize: 18,
            textDecorationLine: 'underline',
        },
        menuItemText: {
            color: theme.text,
        },
        menuImage: {
            width: 100,
            height: 100,
        },
        deleteButton: {
            position: 'absolute',
            right: 10,
            top: 10,
            backgroundColor: 'red',
            borderRadius: 15,
            width: 30,
            height: 30,
            justifyContent: 'center',
            alignItems: 'center',
        },
        deleteButtonText: {
            color: 'white',
            fontWeight: 'bold',
        },
        resetButton: {
            marginTop: 20,
            padding: 15,
            backgroundColor: "red",
            borderRadius: 20,
            alignItems: "center",
            alignSelf: 'center',
            width: 180,
        },
        resetButtonText: {
            color: "white",
            fontWeight: "bold",
        },
        emptyText: {
            textAlign: 'center',
            color: 'red',
            marginTop: 40,
            fontSize: 16,
        },
        image: {
            flex: 1,
            width: '100%',
            height: '100%',
        },
    });
}
