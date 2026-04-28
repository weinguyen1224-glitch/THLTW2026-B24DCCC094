declare module Fitness {
	export interface WorkoutLog {
		id: string;
		date: string;
		type: EWorkoutType;
		duration: number;
		calories: number;
		notes: string;
		status: EWorkoutStatus;
	}

	export interface HealthLog {
		id: string;
		date: string;
		weight: number;
		height: number;
		bmi: number;
		restingHeartRate: number;
		sleepHours: number;
	}

	export interface Goal {
		id: string;
		name: string;
		type: EGoalType;
		targetValue: number;
		currentValue: number;
		deadline: string;
		status: EGoalStatus;
	}

	export interface Exercise {
		id: string;
		name: string;
		muscleGroup: EMuscleGroup;
		difficulty: EDifficulty;
		description: string;
		caloriesPerHour: number;
		instructions: string;
	}

	export type EWorkoutType = 'Cardio' | 'Strength' | 'Yoga' | 'HIIT' | 'Other';
	export type EWorkoutStatus = 'completed' | 'missed';
	export type EGoalType = 'weight_loss' | 'muscle_gain' | 'endurance' | 'other';
	export type EGoalStatus = 'in_progress' | 'achieved' | 'cancelled';
	export type EMuscleGroup = 'Chest' | 'Back' | 'Legs' | 'Shoulders' | 'Arms' | 'Core' | 'Full Body';
	export type EDifficulty = 'easy' | 'medium' | 'hard';
}