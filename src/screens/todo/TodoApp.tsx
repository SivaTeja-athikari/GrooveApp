import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    FlatList,
    Animated,
    LayoutAnimation,
    UIManager,
    Dimensions,
} from 'react-native';
import ConfettiCannon from 'react-native-confetti-cannon';
import Ionicons from '@react-native-vector-icons/ionicons';
import { musicAppColors } from '../../utils/colors';
import { getFromAsyncStorage, storeInAsyncStorage } from '../../utils/storage';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface Todo {
    id: string;
    text: string;
    completed: boolean;
}

const STORAGE_KEY = '@todo_list';

const TodoApp = () => {
    const [todos, setTodos] = useState<Todo[]>([]);
    const [text, setText] = useState('');
    const [confettiOrigin, setConfettiOrigin] = useState({ x: 0, y: 0 });
    const [showConfetti, setShowConfetti] = useState(false);
    const confettiRef = useRef<ConfettiCannon>(null);

    useEffect(() => {
        loadTodos();
    }, []);

    const loadTodos = async () => {
        try {
            const data = await getFromAsyncStorage(STORAGE_KEY);
            if (data) setTodos(JSON.parse(data));
        } catch (e) {
            console.error('Failed to load todos', e);
        }
    };

    const saveTodos = async (newTodos: Todo[]) => {
        try {
            await storeInAsyncStorage(STORAGE_KEY, JSON.stringify(newTodos));
        } catch (e) {
            console.error('Failed to save todos', e);
        }
    };

    const handleAddTodo = () => {
        if (!text.trim()) return;
        const newTodo: Todo = { id: Date.now().toString(), text, completed: false };
        const newTodos = [newTodo, ...todos];
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setTodos(newTodos);
        saveTodos(newTodos);
        setText('');
    };

    const handleToggle = (id: string, origin: { x: number; y: number }) => {
        const newTodos = todos.map(todo => {
            const isToggled = todo.id === id;
            if (isToggled && !todo.completed) {
                const { width, height } = Dimensions.get('window');
                const adjustedOrigin = {
                    x: Math.max(0, Math.min(origin.x, width)),
                    y: Math.max(0, Math.min(origin.y + (Platform.OS === 'ios' ? 44 : 0), height)),
                };
                setConfettiOrigin(adjustedOrigin.x && adjustedOrigin.y ? adjustedOrigin : { x: width / 2, y: height / 2 });
                setShowConfetti(true);
            }
            return isToggled ? { ...todo, completed: !todo.completed } : todo;
        });
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setTodos(newTodos);
        saveTodos(newTodos);
    };

    const handleDelete = (id: string) => {
        const newTodos = todos.filter(todo => todo.id !== id);
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setTodos(newTodos);
        saveTodos(newTodos);
    };

    const TodoItem = ({ item, onToggle, onDelete }: { item: Todo; onToggle: (id: string, origin: { x: number; y: number }) => void; onDelete: (id: string) => void }) => {
        const scaleAnim = useRef(new Animated.Value(1)).current;
        const completeAnim = useRef(new Animated.Value(item.completed ? 1 : 0)).current;
        const checkboxRef = useRef<View>(null);

        useEffect(() => {
            Animated.timing(completeAnim, {
                toValue: item.completed ? 1 : 0,
                duration: 600,
                useNativeDriver: false,
            }).start();
        }, [item.completed]);

        const strikeWidth = completeAnim.interpolate({
            inputRange: [0, 1],
            outputRange: ['0%', '100%'],
        });

        const textColorAnim = completeAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [musicAppColors.textPrimary, musicAppColors.textSecondary],
        });

        const checkFillColor = completeAnim.interpolate({
            inputRange: [0, 1],
            outputRange: ['transparent', musicAppColors.primary],
        });

        const toggle = () => {
            Animated.sequence([
                Animated.timing(scaleAnim, { toValue: 1.05, duration: 100, useNativeDriver: true }),
                Animated.timing(scaleAnim, { toValue: 1, duration: 100, useNativeDriver: true }),
            ]).start(() => {
                if (checkboxRef.current) {
                    checkboxRef.current.measureInWindow((x, y, width, height) => {
                        const { width: screenW, height: screenH } = Dimensions.get('window');
                        onToggle(item.id, { x: isFinite(x) ? x + width / 2 : screenW / 2, y: isFinite(y) ? y + height / 2 : screenH / 2 });
                    });
                } else {
                    const { width: screenW, height: screenH } = Dimensions.get('window');
                    onToggle(item.id, { x: screenW / 2, y: screenH / 2 });
                }
            });
        };

        const AnimatedCard = Animated.createAnimatedComponent(TouchableOpacity);

        return (
            <AnimatedCard
                activeOpacity={0.7}
                onPress={toggle}
                style={[styles.todoCard, { transform: [{ scale: scaleAnim }], zIndex: 1 }]}
            >
                <TouchableOpacity
                    style={styles.checkbox}
                    onPress={toggle}
                >
                    <Animated.View
                        ref={checkboxRef}
                        style={[styles.checkbox, { backgroundColor: checkFillColor, justifyContent: 'center', alignItems: 'center' }]}
                    >
                        {item.completed && (
                            <Ionicons name="checkmark" size={18} color="#fff" />
                        )}
                    </Animated.View>
                </TouchableOpacity>

                <View style={styles.textContainer}>
                    <Animated.Text
                        style={[
                            styles.todoText,
                            { color: textColorAnim },
                        ]}
                    >
                        {item.text}
                    </Animated.Text>
                    <Animated.View
                        style={[
                            styles.strike,
                            { width: strikeWidth, backgroundColor: musicAppColors.primary },
                        ]}
                    />
                </View>

                <TouchableOpacity
                    style={[styles.deleteButton, { backgroundColor: musicAppColors.accent }]}
                    onPress={(e) => {
                        e.stopPropagation();
                        onDelete(item.id);
                    }}
                >
                    <Text style={{ color: musicAppColors.textPrimary, fontWeight: 'bold' }}>
                        Delete
                    </Text>
                </TouchableOpacity>
            </AnimatedCard>
        );
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            {showConfetti && (
                <ConfettiCannon
                    ref={confettiRef}
                    count={30}
                    origin={confettiOrigin}
                    autoStart
                    fadeOut
                    explosionSpeed={100}
                    fallSpeed={800}
                    onAnimationEnd={() => setShowConfetti(false)}
                />
            )}

            <Text style={styles.title}>My Todos</Text>

            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Add a todo..."
                    placeholderTextColor={musicAppColors.textSecondary}
                    value={text}
                    onChangeText={setText}
                    onSubmitEditing={handleAddTodo}
                />
                <TouchableOpacity
                    style={[styles.addButton, { backgroundColor: musicAppColors.primary }]}
                    onPress={handleAddTodo}
                >
                    <Text style={styles.addButtonText}>+</Text>
                </TouchableOpacity>
            </View>

            <FlatList
                data={todos}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => <TodoItem item={item} onToggle={handleToggle} onDelete={handleDelete} />}
                contentContainerStyle={{ paddingBottom: 100 }}
            />
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 60,
        paddingHorizontal: 16,
        backgroundColor: musicAppColors.background,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 24,
        color: musicAppColors.textPrimary,
    },
    inputContainer: {
        flexDirection: 'row',
        marginBottom: 24,
        alignItems: 'center',
    },
    input: {
        flex: 1,
        backgroundColor: musicAppColors.surface,
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 8,
        fontSize: 16,
        color: musicAppColors.textPrimary,
    },
    addButton: {
        marginLeft: 12,
        borderRadius: 8,
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    addButtonText: {
        color: musicAppColors.textPrimary,
        fontSize: 24,
        fontWeight: 'bold',
    },
    todoCard: {
        flexDirection: 'row',
        backgroundColor: musicAppColors.surface,
        padding: 16,
        marginBottom: 12,
        borderRadius: 12,
        alignItems: 'center',
    },
    checkbox: {
        width: 24,
        height: 24,
        borderWidth: 1,
        borderColor: musicAppColors.primary,
        borderRadius: 6,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    textContainer: {
        flex: 1,
        position: 'relative',
    },
    todoText: {
        fontSize: 16,
    },
    strike: {
        position: 'absolute',
        height: 2,
        top: '50%',
        left: 0,
    },
    deleteButton: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 80,
        borderRadius: 12,
        marginLeft: 8,
        paddingVertical: 4,
    },
});

export default TodoApp
