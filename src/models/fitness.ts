import { useState, useCallback, useEffect } from 'react';
import type { Fitness } from '@/services/Fitness/typing';
import * as fitnessService from '@/services/Fitness';

export default () => {
	const [workouts, setWorkouts] = useState<Fitness.WorkoutLog[]>([]);
	const [healthLogs, setHealthLogs] = useState<Fitness.HealthLog[]>([]);
	const [goals, setGoals] = useState<Fitness.Goal[]>([]);
	const [exercises, setExercises] = useState<Fitness.Exercise[]>([]);

	const loadWorkouts = useCallback(() => {
		setWorkouts(fitnessService.getWorkouts());
	}, []);

	const loadHealthLogs = useCallback(() => {
		setHealthLogs(fitnessService.getHealthLogs());
	}, []);

	const loadGoals = useCallback(() => {
		setGoals(fitnessService.getGoals());
	}, []);

	const loadExercises = useCallback(() => {
		setExercises(fitnessService.getExercises());
	}, []);

	const saveWorkout = useCallback((workout: Fitness.WorkoutLog) => {
		fitnessService.saveWorkout(workout);
		loadWorkouts();
	}, [loadWorkouts]);

	const deleteWorkout = useCallback((id: string) => {
		fitnessService.deleteWorkout(id);
		loadWorkouts();
	}, [loadWorkouts]);

	const saveHealthLog = useCallback((log: Fitness.HealthLog) => {
		fitnessService.saveHealthLog(log);
		loadHealthLogs();
	}, [loadHealthLogs]);

	const deleteHealthLog = useCallback((id: string) => {
		fitnessService.deleteHealthLog(id);
		loadHealthLogs();
	}, [loadHealthLogs]);

	const saveGoal = useCallback((goal: Fitness.Goal) => {
		fitnessService.saveGoal(goal);
		loadGoals();
	}, [loadGoals]);

	const deleteGoal = useCallback((id: string) => {
		fitnessService.deleteGoal(id);
		loadGoals();
	}, [loadGoals]);

	const saveExercise = useCallback((exercise: Fitness.Exercise) => {
		fitnessService.saveExercise(exercise);
		loadExercises();
	}, [loadExercises]);

	const deleteExercise = useCallback((id: string) => {
		fitnessService.deleteExercise(id);
		loadExercises();
	}, [loadExercises]);

	const getStats = useCallback(() => {
		const now = new Date();
		const currentMonth = now.getMonth();
		const currentYear = now.getFullYear();

		const monthWorkouts = workouts.filter((w) => {
			const date = new Date(w.date);
			return date.getMonth() === currentMonth && date.getFullYear() === currentYear && w.status === 'completed';
		});

		const totalSessions = monthWorkouts.length;
		const totalCalories = monthWorkouts.reduce((sum, w) => sum + w.calories, 0);

		const completedGoals = goals.filter((g) => g.status === 'achieved').length;
		const inProgressGoals = goals.filter((g) => g.status === 'in_progress').length;
		const goalCompletionRate = inProgressGoals > 0 ? Math.round((completedGoals / (completedGoals + inProgressGoals)) * 100) : 0;

		let streak = 0;
		const sortedWorkouts = [...monthWorkouts].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
		const dates = sortedWorkouts.map((w) => w.date.split('T')[0]);
		const uniqueDates = [...new Set(dates)];

		if (uniqueDates.length > 0) {
			const today = now.toISOString().split('T')[0];
			const yesterday = new Date(now.setDate(now.getDate() - 1)).toISOString().split('T')[0];

			if (uniqueDates[0] === today || uniqueDates[0] === yesterday) {
				streak = 1;
				for (let i = 1; i < uniqueDates.length; i++) {
					const prev = new Date(uniqueDates[i - 1]);
					const curr = new Date(uniqueDates[i]);
					const diff = (prev.getTime() - curr.getTime()) / (1000 * 60 * 60 * 24);
					if (diff === 1) {
						streak++;
					} else {
						break;
					}
				}
			}
		}

		return { totalSessions, totalCalories, streak, goalCompletionRate };
	}, [workouts, goals]);

	const getWeeklyWorkouts = useCallback(() => {
		const now = new Date();
		const weeks: { week: string; count: number }[] = [];

		for (let i = 3; i >= 0; i--) {
			const weekStart = new Date(now);
			weekStart.setDate(now.getDate() - (i * 7 + 6));
			const weekEnd = new Date(now);
			weekEnd.setDate(now.getDate() - i * 7);

			const weekLabel = `Tuần ${4 - i}`;
			const count = workouts.filter((w) => {
				const date = new Date(w.date);
				return date >= weekStart && date <= weekEnd && w.status === 'completed';
			}).length;

			weeks.push({ week: weekLabel, count });
		}

		return weeks;
	}, [workouts]);

	const getWeightHistory = useCallback(() => {
		return healthLogs
			.map((log) => ({ date: log.date, weight: log.weight }))
			.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
			.slice(-5);
	}, [healthLogs]);

	const getRecentWorkouts = useCallback(() => {
		return [...workouts]
			.filter((w) => w.status === 'completed')
			.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
			.slice(0, 5);
	}, [workouts]);

	useEffect(() => {
		loadWorkouts();
		loadHealthLogs();
		loadGoals();
		loadExercises();
	}, []);

	return {
		workouts, healthLogs, goals, exercises,
		loadWorkouts, loadHealthLogs, loadGoals, loadExercises,
		saveWorkout, deleteWorkout, saveHealthLog, deleteHealthLog,
		saveGoal, deleteGoal, saveExercise, deleteExercise,
		getStats, getWeeklyWorkouts, getWeightHistory, getRecentWorkouts,
	};
};