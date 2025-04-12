import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, Animated, StyleSheet, LayoutAnimation, Platform, UIManager } from 'react-native';
import { ChevronDown } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from 'expo-router';
import { useLayoutEffect } from 'react';

// Type cho QA item
type QAItem = {
    id: string;
    question: string;
    answer: string;
};

// Dữ liệu mẫu
const QA_DATA: QAItem[] = [
    { id: '1', question: 'Tôi trộn các chất dinh dưỡng theo thứ tự nào?', answer: 'Bạn nên trộn các chất dinh dưỡng theo thứ tự ABC để đảm bảo hiệu quả tối ưu.' },
    { id: '2', question: 'Tôi có thể giữ dưỡng dịch dinh dưỡng hỗn hợp trong bao lâu?', answer: 'Dinh dưỡng cao cấp nên được sử dụng trong vòng 7 ngày để đạt hiệu quả tốt nhất.' },
    { id: '3', question: 'Khi nào tôi thêm bộ điều chỉnh pH?', answer: 'Bộ điều chỉnh pH nên thêm vào sau khi đã pha xong dung dịch dinh dưỡng.' },
    { id: '4', question: 'Các chất điều chỉnh tăng trưởng có được sử dụng trong sản phẩm Planta không?', answer: 'Sản phẩm Planta không sử dụng chất điều chỉnh tăng trưởng nhân tạo.' },
];

// Bật LayoutAnimation cho Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

const QAItemComponent = ({ item }: { item: QAItem }) => {

    const navigation = useNavigation();
    
      useLayoutEffect(() => {
        navigation.setOptions({
          tabBarStyle: { display: 'none' },
        });
      }, [navigation]);

    const [expanded, setExpanded] = useState(false);
    const rotateAnim = useRef(new Animated.Value(0)).current;

    const toggleExpand = () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setExpanded(prev => !prev);

        Animated.timing(rotateAnim, {
            toValue: expanded ? 0 : 1,
            duration: 300,
            useNativeDriver: true,
        }).start();
    };

    const rotateInterpolate = rotateAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '180deg'],
    });

    return (
        <View style={styles.itemContainer}>
            <TouchableOpacity onPress={toggleExpand} style={styles.questionContainer} activeOpacity={0.8}>
                <Text style={styles.questionText}>{item.question}</Text>
                <Animated.View style={{ transform: [{ rotate: rotateInterpolate }] }}>
                    <ChevronDown size={20} color="black" />
                </Animated.View>
            </TouchableOpacity>
            {expanded && (
                <View style={styles.answerContainer}>
                    <Text style={styles.answerText}>{item.answer}</Text>
                </View>
            )}
        </View>
    );
};

const QAListScreen = () => {
    const router = useRouter();

    return (
        <View style={styles.container}>
            {/* Header có nút Back */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.push("/profile")} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="black" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Q & R</Text>
            </View>

            {/* Danh sách câu hỏi */}
            {QA_DATA.map((item) => (
                <QAItemComponent key={item.id} item={item} />
            ))}
        </View>
    );
};

export default QAListScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        paddingHorizontal: 16,
        paddingTop: 16,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    backButton: {
        padding: 8,
        marginRight: 8,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    itemContainer: {
        marginBottom: 12,
        borderBottomWidth: 1,
        borderColor: '#eee',
        paddingBottom: 8,
    },
    questionContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    questionText: {
        fontSize: 16,
        fontWeight: '600',
        flex: 1,
        marginRight: 8,
    },
    answerContainer: {
        marginTop: 8,
        overflow: 'hidden',
    },
    answerText: {
        fontSize: 14,
        color: '#555',
    },
});
