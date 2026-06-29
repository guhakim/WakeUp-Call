import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../services/motion_service.dart';

class MotionState {
  final int noMotionSeconds;
  final int timeUntilCall;

  const MotionState({this.noMotionSeconds = 0, this.timeUntilCall = 180});
}

class MotionNotifier extends StateNotifier<MotionState> {
  final _service = MotionService();

  MotionNotifier() : super(const MotionState());

  void start({required Future<void> Function() onVoipTrigger}) {
    _service.start(
      onTick: (noMotionSec, timeUntilCall) {
        state = MotionState(noMotionSeconds: noMotionSec, timeUntilCall: timeUntilCall);
      },
      onVoipTrigger: () => onVoipTrigger(),
    );
  }

  void stop() => _service.stop();

  @override
  void dispose() {
    _service.stop();
    super.dispose();
  }
}

final motionProvider = StateNotifierProvider<MotionNotifier, MotionState>(
  (_) => MotionNotifier(),
);
