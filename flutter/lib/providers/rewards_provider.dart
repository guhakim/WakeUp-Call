import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:shared_preferences/shared_preferences.dart';

class RewardsState {
  final int points;
  final int streak;

  const RewardsState({this.points = 0, this.streak = 0});
}

class RewardsNotifier extends StateNotifier<RewardsState> {
  RewardsNotifier() : super(const RewardsState()) {
    _load();
  }

  Future<void> _load() async {
    final prefs = await SharedPreferences.getInstance();
    state = RewardsState(
      points: prefs.getInt('points') ?? 0,
      streak: prefs.getInt('streak') ?? 0,
    );
  }

  Future<void> addPoints(int amount, String reason) async {
    final prefs = await SharedPreferences.getInstance();
    final newPoints = state.points + amount;
    final newStreak = state.streak + 1;
    await prefs.setInt('points', newPoints);
    await prefs.setInt('streak', newStreak);
    state = RewardsState(points: newPoints, streak: newStreak);
  }
}

final rewardsProvider = StateNotifierProvider<RewardsNotifier, RewardsState>(
  (_) => RewardsNotifier(),
);
