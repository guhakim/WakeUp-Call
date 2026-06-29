import 'package:dio/dio.dart';
import 'package:shared_preferences/shared_preferences.dart';

class AlarmApiService {
  static const _base = String.fromEnvironment(
    'API_URL',
    defaultValue: 'http://localhost:3001/api',
  );
  static final _dio = Dio(BaseOptions(baseUrl: _base, connectTimeout: const Duration(seconds: 5)));

  static Future<Map<String, dynamic>> register({
    required String phoneNumber,
    required int hour,
    required int minute,
    required String label,
  }) async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final userId = prefs.getString('user_id') ?? 'unknown';
      final res = await _dio.post('/alarm/register', data: {
        'userId': userId,
        'phoneNumber': phoneNumber,
        'hour': hour,
        'minute': minute,
        'label': label,
      });
      // 서버 alarmId 저장 (기상 확인 핑용)
      if (res.data['alarm']?['id'] != null) {
        await prefs.setString('active_alarm_id', res.data['alarm']['id']);
      }
      return res.data;
    } catch (_) {
      return {'success': false, 'offline': true};
    }
  }

  // TSK-005: 기상 확인 핑 — 알람 시간 후 앱에서 주기적으로 호출
  static Future<void> confirmWake() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final alarmId = prefs.getString('active_alarm_id');
      if (alarmId == null) return;
      await _dio.post('/alarm/wake-confirm', data: {'alarmId': alarmId});
      await prefs.remove('active_alarm_id');
    } catch (_) {}
  }

  // VoIP 직접 트리거
  static Future<void> triggerVoip() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final phone = prefs.getString('phone_number') ?? '';
      await _dio.post('/voip/trigger', data: {'phoneNumber': phone});
    } catch (_) {}
  }
}
