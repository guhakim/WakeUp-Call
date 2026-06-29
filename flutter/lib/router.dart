import 'package:go_router/go_router.dart';
import 'screens/setup_screen.dart';
import 'screens/home_screen.dart';
import 'screens/alarm_ring_screen.dart';
import 'screens/wake_complete_screen.dart';
import 'screens/rewards_screen.dart';

final appRouter = GoRouter(
  initialLocation: '/setup',
  routes: [
    GoRoute(path: '/setup',    builder: (ctx, _) => const SetupScreen()),
    GoRoute(path: '/home',     builder: (ctx, _) => const HomeScreen()),
    GoRoute(path: '/ring',     builder: (ctx, _) => const AlarmRingScreen()),
    GoRoute(path: '/complete', builder: (ctx, _) => const WakeCompleteScreen()),
    GoRoute(path: '/rewards',  builder: (ctx, _) => const RewardsScreen()),
  ],
);
