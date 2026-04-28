import type { Fitness } from './typing';
import { EStorageKey } from './constant';

const generateId = () => Math.random().toString(36).substring(2, 9);

const defaultExercises: Fitness.Exercise[] = [
	{ id: '1', name: 'Push Up', muscleGroup: 'Chest', difficulty: 'easy', description: 'Bài tập cơ ngực cơ bản', caloriesPerHour: 350, instructions: '1. Nằm sấp, tay đặt rộng hơn vai\n2. Hạ người xuống直到胸部 chạm sàn\n3. Đẩy người lên\n4. Lặp lại' },
	{ id: '2', name: 'Pull Up', muscleGroup: 'Back', difficulty: 'hard', description: 'Kéo xà đơn', caloriesPerHour: 400, instructions: '1. Nắm thanh xà rộng hơn vai\n2. Kéo người lên直到 cằm cao hơn thanh\n3. Hạ người xuống từ từ\n4. Lặp lại' },
	{ id: '3', name: 'Squat', muscleGroup: 'Legs', difficulty: 'easy', description: 'Ngồi xổm', caloriesPerHour: 300, instructions: '1. Đứng thẳng, chân rộng bằng vai\n2. Hạ mông xuống như ngồi ghế\n3. Giữ lưng thẳng\n4. Đứng lên' },
	{ id: '4', name: 'Plank', muscleGroup: 'Core', difficulty: 'medium', description: 'H plank cố thế', caloriesPerHour: 250, instructions: '1. Nằm sấp, chống khuỷu tay\n2. Nâng người lên, giữ thẳng\n3. Giữ 30-60 giây\n4. Nghỉ và lặp lại' },
	{ id: '5', name: 'Lunges', muscleGroup: 'Legs', difficulty: 'medium', description: 'Bước lùi', caloriesPerHour: 280, instructions: '1. Đứng thẳng\n2. Bước một chân về phía trước, hạ xuống\n3. Quay về vị trí ban đầu\n4. Đổi chân' },
	{ id: '6', name: 'Burpees', muscleGroup: 'Full Body', difficulty: 'hard', description: 'Bài tập toàn thân', caloriesPerHour: 500, instructions: '1. Đứng thẳng\n2. Ngồi xổm, đặt tay xuống sàn\n3. Nhảy chân ra sau thành tư thế plank\n4. Nhảy về và đứng lên' },
	{ id: '7', name: 'Shoulder Press', muscleGroup: 'Shoulders', difficulty: 'medium', description: 'Đẩy tạ vai', caloriesPerHour: 320, instructions: '1. Đứng hoặc ngồi với tạ trên vai\n2. Đẩy tạ lên cao\n3. Hạ xuống từ từ\n4. Lặp lại' },
	{ id: '8', name: 'Bicep Curl', muscleGroup: 'Arms', difficulty: 'easy', description: 'Cuộn tạ bắp tay', caloriesPerHour: 200, instructions: '1. Đứng với tạ trên tay\n2. Cuộn tạ lên đến vai\n3. Hạ xuống từ từ\n4. Lặp lại' },
	{ id: '9', name: 'Deadlift', muscleGroup: 'Back', difficulty: 'hard', description: 'Nâng tạ từ sàn', caloriesPerHour: 400, instructions: '1. Đứng với chân rộng bằng vai\n2. Nghiêng người, nắm tạ\n3. Đứng lên, giữ lưng thẳng\n4. Hạ tạ xuống' },
	{ id: '10', name: 'Crunches', muscleGroup: 'Core', difficulty: 'easy', description: 'Gập bụng', caloriesPerHour: 200, instructions: '1. Nằm ngửa, chân gập\n2. Đặt tay sau đầu\n3. Nâng vai lên, co bụng\n4. Hạ xuống và lặp lại' },
	{ id: '11', name: 'Running', muscleGroup: 'Legs', difficulty: 'medium', description: 'Chạy bộ', caloriesPerHour: 450, instructions: '1. Khởi động 5 phút\n2. Chạy với tốc độ vừa phải\n3. Giữ nhịp thở đều\n4. Cool down 5 phút' },
	{ id: '12', name: 'Yoga Flow', muscleGroup: 'Full Body', difficulty: 'medium', description: 'Yoga dây', caloriesPerHour: 250, instructions: '1. Khởi động nhẹ\n2. Thực hiện các động tác liên tục\n3. Giữ nhịp thở đều\n4. Thư giãn cuối buổi' },
];

const defaultHealthLogs: Fitness.HealthLog[] = [
	{ id: '1', date: '2024-03-01', weight: 70, height: 170, bmi: 24.22, restingHeartRate: 72, sleepHours: 7 },
	{ id: '2', date: '2024-03-08', weight: 69.5, height: 170, bmi: 24.06, restingHeartRate: 70, sleepHours: 7.5 },
	{ id: '3', date: '2024-03-15', weight: 69, height: 170, bmi: 23.89, restingHeartRate: 68, sleepHours: 8 },
	{ id: '4', date: '2024-03-22', weight: 68.5, height: 170, bmi: 23.71, restingHeartRate: 69, sleepHours: 7.5 },
	{ id: '5', date: '2024-03-29', weight: 68, height: 170, bmi: 23.53, restingHeartRate: 67, sleepHours: 8 },
];

const defaultWorkouts: Fitness.WorkoutLog[] = [
	{ id: '1', date: '2024-03-01', type: 'Cardio', duration: 45, calories: 350, notes: 'Chạy bộ ngoài trời', status: 'completed' },
	{ id: '2', date: '2024-03-03', type: 'Strength', duration: 60, calories: 400, notes: 'Tập ngực và vai', status: 'completed' },
	{ id: '3', date: '2024-03-05', type: 'Yoga', duration: 30, calories: 120, notes: 'Yoga buổi sáng', status: 'completed' },
	{ id: '4', date: '2024-03-07', type: 'HIIT', duration: 25, calories: 300, notes: 'Tabata training', status: 'completed' },
	{ id: '5', date: '2024-03-10', type: 'Cardio', duration: 50, calories: 400, notes: 'Đạp xe', status: 'completed' },
	{ id: '6', date: '2024-03-12', type: 'Strength', duration: 55, calories: 380, notes: 'Tập chân', status: 'completed' },
	{ id: '7', date: '2024-03-14', type: 'Yoga', duration: 45, calories: 180, notes: 'Power Yoga', status: 'completed' },
	{ id: '8', date: '2024-03-16', type: 'HIIT', duration: 20, calories: 250, notes: 'Circuit training', status: 'completed' },
	{ id: '9', date: '2024-03-18', type: 'Cardio', duration: 40, calories: 320, notes: 'Bơi lội', status: 'completed' },
	{ id: '10', date: '2024-03-20', type: 'Strength', duration: 60, calories: 420, notes: 'Tập lưng và bắp tay', status: 'completed' },
];

const defaultGoals: Fitness.Goal[] = [
	{ id: '1', name: 'Giảm 3kg trong tháng', type: 'weight_loss', targetValue: 3, currentValue: 2, deadline: '2024-04-01', status: 'in_progress' },
	{ id: '2', name: 'Tập 20 buổi/tháng', type: 'endurance', targetValue: 20, currentValue: 10, deadline: '2024-04-30', status: 'in_progress' },
	{ id: '3', name: 'Chạy 5km trong 30 phút', type: 'endurance', targetValue: 5, currentValue: 5, deadline: '2024-03-30', status: 'achieved' },
];

const getData = <T>(key: string, defaultValue: T): T => {
	const data = localStorage.getItem(key);
	return data ? JSON.parse(data) : defaultValue;
};

const setData = (key: string, data: unknown) => {
	localStorage.setItem(key, JSON.stringify(data));
};

export const getWorkouts = (): Fitness.WorkoutLog[] => {
	const data = getData<Fitness.WorkoutLog[]>(EStorageKey.FITNESS_WORKOUTS, defaultWorkouts);
	return data.length ? data : defaultWorkouts;
};

export const saveWorkout = (workout: Fitness.WorkoutLog): void => {
	const workouts = getWorkouts();
	const index = workouts.findIndex((w) => w.id === workout.id);
	if (index >= 0) {
		workouts[index] = workout;
	} else {
		workouts.unshift(workout);
	}
	setData(EStorageKey.FITNESS_WORKOUTS, workouts);
};

export const deleteWorkout = (id: string): void => {
	const workouts = getWorkouts().filter((w) => w.id !== id);
	setData(EStorageKey.FITNESS_WORKOUTS, workouts);
};

export const getHealthLogs = (): Fitness.HealthLog[] => {
	const data = getData<Fitness.HealthLog[]>(EStorageKey.FITNESS_HEALTH, defaultHealthLogs);
	return data.length ? data : defaultHealthLogs;
};

export const saveHealthLog = (log: Fitness.HealthLog): void => {
	const logs = getHealthLogs();
	const index = logs.findIndex((l) => l.id === log.id);
	if (index >= 0) {
		logs[index] = log;
	} else {
		logs.unshift(log);
	}
	setData(EStorageKey.FITNESS_HEALTH, logs);
};

export const deleteHealthLog = (id: string): void => {
	const logs = getHealthLogs().filter((l) => l.id !== id);
	setData(EStorageKey.FITNESS_HEALTH, logs);
};

export const getGoals = (): Fitness.Goal[] => {
	const data = getData<Fitness.Goal[]>(EStorageKey.FITNESS_GOALS, defaultGoals);
	return data.length ? data : defaultGoals;
};

export const saveGoal = (goal: Fitness.Goal): void => {
	const goals = getGoals();
	const index = goals.findIndex((g) => g.id === goal.id);
	if (index >= 0) {
		goals[index] = goal;
	} else {
		goals.push(goal);
	}
	setData(EStorageKey.FITNESS_GOALS, goals);
};

export const deleteGoal = (id: string): void => {
	const goals = getGoals().filter((g) => g.id !== id);
	setData(EStorageKey.FITNESS_GOALS, goals);
};

export const getExercises = (): Fitness.Exercise[] => {
	const data = getData<Fitness.Exercise[]>(EStorageKey.FITNESS_EXERCISES, defaultExercises);
	return data.length ? data : defaultExercises;
};

export const saveExercise = (exercise: Fitness.Exercise): void => {
	const exercises = getExercises();
	const index = exercises.findIndex((e) => e.id === exercise.id);
	if (index >= 0) {
		exercises[index] = exercise;
	} else {
		exercises.push(exercise);
	}
	setData(EStorageKey.FITNESS_EXERCISES, exercises);
};

export const deleteExercise = (id: string): void => {
	const exercises = getExercises().filter((e) => e.id !== id);
	setData(EStorageKey.FITNESS_EXERCISES, exercises);
};

export const getBMIStatus = (bmi: number): { label: string; color: string } => {
	if (bmi < 18.5) return { label: 'Thiếu cân', color: 'blue' };
	if (bmi < 25) return { label: 'Bình thường', color: 'green' };
	if (bmi < 30) return { label: 'Thừa cân', color: 'gold' };
	return { label: 'Béo phì', color: 'red' };
};

export const calculateBMI = (weight: number, height: number): number => {
	const heightM = height / 100;
	return Math.round((weight / (heightM * heightM)) * 100) / 100;
};

export { generateId };