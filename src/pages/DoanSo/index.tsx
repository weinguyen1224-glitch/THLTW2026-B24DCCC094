import { useState, useEffect } from 'react';
import { Card, Input, Button, Alert, Typography, Statistic } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const DoanSo: React.FC = () => {
	const [randomNumber, setRandomNumber] = useState<number>(0);
	const [guess, setGuess] = useState<string>('');
	const [attempts, setAttempts] = useState<number>(10);
	const [message, setMessage] = useState<string>('');
	const [gameOver, setGameOver] = useState<boolean>(false);
	const [won, setWon] = useState<boolean>(false);

	useEffect(() => {
		startNewGame();
	}, []);

	const startNewGame = () => {
		const newNumber = Math.floor(Math.random() * 100) + 1;
		setRandomNumber(newNumber);
		setGuess('');
		setAttempts(10);
		setMessage('');
		setGameOver(false);
		setWon(false);
	};

	const handleGuess = () => {
		const num = parseInt(guess);
		if (isNaN(num) || num < 1 || num > 100) {
			setMessage('Vui lòng nhập số từ 1 đến 100!');
			return;
		}

		const remainingAttempts = attempts - 1;
		setAttempts(remainingAttempts);

		if (num === randomNumber) {
			setMessage('Chúc mừng! Bạn đã đoán đúng!');
			setWon(true);
			setGameOver(true);
		} else if (remainingAttempts === 0) {
			setMessage(`Bạn đã hết lượt! Số đúng là ${randomNumber}.`);
			setGameOver(true);
		} else if (num < randomNumber) {
			setMessage('Bạn đoán quá thấp!');
		} else {
			setMessage('Bạn đoán quá cao!');
		}
		setGuess('');
	};

	const handleKeyPress = (e: React.KeyboardEvent) => {
		if (e.key === 'Enter' && !gameOver) {
			handleGuess();
		}
	};

	return (
		<div style={{ maxWidth: 600, margin: '0 auto', padding: '20px' }}>
			<Card>
				<div style={{ textAlign: 'center' }}>
					<Title level={2}>Trò Chơi Đoán Số</Title>
					<Text type='secondary'>Hệ thống đã sinh ra một số ngẫu nhiên từ 1 đến 100. Bạn có 10 lượt để đoán!</Text>
				</div>

				<div style={{ textAlign: 'center', margin: '24px 0' }}>
					<Statistic
						title='Số lượt còn lại'
						value={attempts}
						valueStyle={{ color: attempts <= 3 ? '#ff4d4f' : '#3f8600' }}
					/>
				</div>

				{message && (
					<Alert
						message={message}
						type={won ? 'success' : gameOver ? 'error' : 'info'}
						showIcon
						style={{ marginBottom: 16 }}
					/>
				)}

				{!gameOver && (
					<div style={{ display: 'flex', gap: 8 }}>
						<Input
							placeholder='Nhập số dự đoán (1-100)'
							value={guess}
							onChange={(e) => setGuess(e.target.value)}
							onKeyPress={handleKeyPress}
							type='number'
							min={1}
							max={100}
							size='large'
						/>
						<Button type='primary' size='large' onClick={handleGuess} disabled={gameOver}>
							Đoán
						</Button>
					</div>
				)}

				<div style={{ textAlign: 'center', marginTop: 24 }}>
					<Button type='default' icon={<ReloadOutlined />} onClick={startNewGame} size='large'>
						Chơi Lại
					</Button>
				</div>
			</Card>
		</div>
	);
};

export default DoanSo;
