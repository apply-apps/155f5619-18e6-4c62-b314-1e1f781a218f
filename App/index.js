// Filename: index.js
// Combined code from all files

import React, { useState, useEffect, useRef } from 'react';
import { SafeAreaView, StyleSheet, View, Text, Button, Alert } from 'react-native';

const GRID_SIZE = 20;
const CELL_SIZE = 15;
const DIRECTIONS = {
    UP: { x: 0, y: -1 },
    DOWN: { x: 0, y: 1 },
    LEFT: { x: -1, y: 0 },
    RIGHT: { x: 1, y: 0 }
};

const getRandomPosition = () => ({
    x: Math.floor(Math.random() * GRID_SIZE),
    y: Math.floor(Math.random() * GRID_SIZE),
});

export default function App() {
    const [snake, setSnake] = useState([{ x: 2, y: 2 }]);
    const [food, setFood] = useState(getRandomPosition());
    const [direction, setDirection] = useState(DIRECTIONS.RIGHT);
    const [isPlaying, setIsPlaying] = useState(false);
    const timerRef = useRef(null);

    useEffect(() => {
        if (isPlaying) {
            timerRef.current = setInterval(moveSnake, 200);
        } else {
            clearInterval(timerRef.current);
        }
        return () => clearInterval(timerRef.current);
    }, [isPlaying, direction]);

    useEffect(() => {
        const handleKeyDown = (e) => {
            switch (e.keyCode) {
                case 37:
                    setDirection(DIRECTIONS.LEFT);
                    break;
                case 38:
                    setDirection(DIRECTIONS.UP);
                    break;
                case 39:
                    setDirection(DIRECTIONS.RIGHT);
                    break;
                case 40:
                    setDirection(DIRECTIONS.DOWN);
                    break;
            }
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, []);

    const moveSnake = () => {
        let newSnake = [...snake];
        let head = { ...newSnake[0] };
        head.x += direction.x;
        head.y += direction.y;

        if (head.x === food.x && head.y === food.y) {
            newSnake.push({});
            setFood(getRandomPosition());
        } else {
            newSnake.pop();
        }

        if (checkCollision(head, newSnake)) {
            Alert.alert('Game Over');
            setIsPlaying(false);
            setSnake([{ x: 2, y: 2 }]);
            setDirection(DIRECTIONS.RIGHT);
            return;
        }

        newSnake.unshift(head);
        setSnake(newSnake);
    };

    const checkCollision = (head, newSnake) => {
        if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
            return true;
        }
        for (let segment of newSnake) {
            if (segment.x === head.x && segment.y === head.y) {
                return true;
            }
        }
        return false;
    };

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>Snake Game</Text>
            <Button title={isPlaying ? "Stop" : "Start"} onPress={() => setIsPlaying(!isPlaying)} />
            <View style={styles.grid}>
                {Array.from({ length: GRID_SIZE }).map((_, rowIndex) => (
                    <View style={styles.row} key={rowIndex}>
                        {Array.from({ length: GRID_SIZE }).map((_, columnIndex) => (
                            <View
                                style={[
                                    styles.cell,
                                    snake.some(segment => segment.x === columnIndex && segment.y === rowIndex) && styles.snake,
                                    food.x === columnIndex && food.y === rowIndex && styles.food
                                ]}
                                key={columnIndex}
                            />
                        ))}
                    </View>
                ))}
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 32
    },
    title: {
        fontSize: 20,
        marginBottom: 20,
        fontWeight: 'bold'
    },
    grid: {
        width: GRID_SIZE * CELL_SIZE,
        height: (GRID_SIZE + 2) * CELL_SIZE,
        backgroundColor: '#FAFAFA',
        borderWidth: 5,
        borderColor: '#333',
    },
    row: {
        flexDirection: 'row',
    },
    cell: {
        width: CELL_SIZE,
        height: CELL_SIZE,
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#DDDDDD'
    },
    snake: {
        backgroundColor: '#3DBF46'
    },
    food: {
        backgroundColor: '#FF0000'
    }
});