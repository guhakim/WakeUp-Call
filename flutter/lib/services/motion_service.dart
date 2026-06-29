import 'dart:async';
import 'package:sensors_plus/sensors_plus.dart';

const double _motionThreshold = 3.0;   // m/s² 임계값
const int _noMotionLimitSec  = 180;    // 3분 (PRD: 3~5분)

class MotionService {
  StreamSubscription<AccelerometerEvent>? _accelSub;
  Timer? _ticker;
  DateTime _lastMotion = DateTime.now();

  int noMotionSeconds = 0;
  int get timeUntilCall => (_noMotionLimitSec - noMotionSeconds).clamp(0, _noMotionLimitSec);
  bool get shouldTriggerCall => noMotionSeconds >= _noMotionLimitSec;

  void start({
    required void Function(int noMotionSec, int timeUntilCall) onTick,
    required void Function() onVoipTrigger,
  }) {
    _lastMotion = DateTime.now();

    // 가속도 센서 구독
    _accelSub = accelerometerEventStream(
      samplingPeriod: const Duration(milliseconds: 200),
    ).listen((event) {
      final magnitude = (event.x * event.x + event.y * event.y + event.z * event.z);
      final accel = magnitude - 96.04; // 중력(9.8²) 제거
      if (accel.abs() > _motionThreshold * _motionThreshold) {
        _lastMotion = DateTime.now();
      }
    });

    // 1초마다 미기상 시간 누적
    _ticker = Timer.periodic(const Duration(seconds: 1), (_) {
      noMotionSeconds = DateTime.now().difference(_lastMotion).inSeconds;
      onTick(noMotionSeconds, timeUntilCall);
      if (shouldTriggerCall) {
        stop();
        onVoipTrigger();
      }
    });
  }

  void confirmAwake() {
    _lastMotion = DateTime.now();
    noMotionSeconds = 0;
  }

  void stop() {
    _accelSub?.cancel();
    _ticker?.cancel();
    _accelSub = null;
    _ticker = null;
  }
}
