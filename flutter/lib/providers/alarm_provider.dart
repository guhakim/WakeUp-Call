import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../models/alarm_model.dart';

class AlarmNotifier extends StateNotifier<List<AlarmModel>> {
  Timer? _ticker;

  AlarmNotifier() : super([
    AlarmModel(id: '1', hour: 7, minute: 30, label: '출근'),
  ]);

  void add({required int hour, required int minute, String label = '알람'}) {
    state = [...state, AlarmModel(id: DateTime.now().millisecondsSinceEpoch.toString(), hour: hour, minute: minute, label: label)];
  }

  void remove(String id) {
    state = state.where((a) => a.id != id).toList();
  }

  void startMonitoring({required void Function() onAlarmFired}) {
    _ticker?.cancel();
    _ticker = Timer.periodic(const Duration(seconds: 1), (_) {
      final now = DateTime.now();
      for (final alarm in state) {
        if (alarm.hour == now.hour && alarm.minute == now.minute && now.second < 5) {
          onAlarmFired();
          break;
        }
      }
    });
  }

  @override
  void dispose() {
    _ticker?.cancel();
    super.dispose();
  }
}

final alarmProvider = StateNotifierProvider<AlarmNotifier, List<AlarmModel>>(
  (_) => AlarmNotifier(),
);
