// Filename: index.js
// Combined code from all files

import React, { useState, useEffect, useRef } from 'react';
import { SafeAreaView, StyleSheet, View, Text, Button, Dimensions } from 'react-native';

const CELL_SIZE = 20;
const GRID_SIZE = 15;
const INITIAL_POSITION = { x: 5, y: 5 };

const getRandomPosition = () => ({
    x: Math.floor(Math.random() * GRID_SIZE),
    y: Math.floor(Math.random() * GRID_SIZE)
});

const App = () => {
    const [snake, setSnake] = useState([INITIAL_POSITION]);
    const [direction, setDirection] = useState({ x: 1, y: 0 });
    const [food, setFood] = useState(getRandomPosition());
    const [isGameOver, setIsGameOver] = useState(false);
    const intervalRef = useRef();

    useEffect(() => {
        const handleKeyPress = (e) => {
            switch (e.key) {
                case 'ArrowUp':
                    setDirection({ x: 0, y: -1 });
                    break;
                case 'ArrowDown':
                    setDirection({ x: 0, y: 1 });
                    break;
                case 'ArrowLeft':
                    setDirection({ x: -1, y: 0 });
                    break;
                case 'ArrowRight':
                    setDirection({ x: 1, y: 0 });
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, []);

    useEffect(() => {
        if (!isGameOver) {
            intervalRef.current = setInterval(moveSnake, 200);
            return () => clearInterval(intervalRef.current);
        }
    }, [direction, isGameOver]);

    const moveSnake = () => {
        const newHead = {
            x: snake[0].x + direction.x,
            y: snake[0].y + direction.y
        };

        if (
            newHead.x >= GRID_SIZE ||
            newHead.x < 0 ||
            newHead.y >= GRID_SIZE ||
            newHead.y < 0 ||
            snake.some(segment => segment.x === newHead.x && segment.y === newHead.y)
        ) {
            setIsGameOver(true);
            return;
        }

        const newSnake = [newHead, ...snake];
        if (newHead.x === food.x && newHead.y === food.y) {
            setFood(getRandomPosition());
        } else {
            newSnake.pop();
        }
        setSnake(newSnake);
    };

    const resetGame = () => {
        setSnake([INITIAL_POSITION]);
        setDirection({ x: 1, y: 0 });
        setFood(getRandomPosition());
        setIsGameOver(false);
    };

    return (
        <SafeAreaView style={styles.container}>
            {isGameOver ? (
                <View style={styles.gameOverContainer}>
                    <Text style={styles.gameOverText}>Game Over</Text>
                    <Button title="Restart" onPress={resetGame} />
                </View>
            ) : (
                <View>
                    <View style={styles.grid}>
                        {Array.from({ length: GRID_SIZE }).map((_, row) =>
                            Array.from({ length: GRID_SIZE }).map((_, col) => (
                                <View
                                    key={`cell-${row}-${col}`}
                                    style={[
                                        styles.cell,
                                        snake.some(segment => segment.x === col && segment.y === row) && styles.snake,
                                        food.x === col && food.y === row && styles.food
                                    ]}
                                />
                            ))
                        )}
                    </View>
                    <Text style={styles.infoText}>
                        Use arrow keys to move the snake. Eat the food to grow!
                    </Text>
                </View>
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        width: GRID_SIZE * CELL_SIZE,
        height: GRID_SIZE * CELL_SIZE,
        borderColor: '#000',
        borderWidth: 1,
        backgroundColor: '#EAF6F6'
    },
    cell: {
        width: CELL_SIZE,
        height: CELL_SIZE,
        borderColor: '#ccc',
        borderWidth: 0.5
    },
    snake: {
        backgroundColor: '#4ECB71'
    },
    food: {
        backgroundColor: '#FF4F4F'
    },
    gameOverContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    gameOverText: {
        fontSize: 24,
        marginBottom: 20,
    },
    infoText: {
        marginTop: 20,
        textAlign: 'center',
    },
});

export default App;