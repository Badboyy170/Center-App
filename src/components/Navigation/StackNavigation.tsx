import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { ManageExams } from "../Exams";
import Degrees from "../Exams/Degrees";

const Stack = createNativeStackNavigator();
const StackNavigation =()=>{
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="ManageExams"
                component={ManageExams}
            />
            <Stack.Screen
                name="Degrees"
                component={Degrees}
            />
        </Stack.Navigator>
    );
}